class CaixaDaLanchonete {

jsonCardapio = [
    { 
        "codigo": "cafe",
        "descricao": "cafe",
        "valor": 3
    },
    { 
        "codigo": "chantily",
        "descricao": "chantily (extra do cafe)",
        "valor": 1.50
    },
    { 
        "codigo": "suco",
        "descricao": "suco natural",
        "valor": 6.20
    },
    { 
        "codigo":"sanduiche",
        "descricao": "sanduiche",
        "valor": 6.50
    },
    { 
        "codigo":"queijo",
        "descricao": "queijo (extra do sanduiche)",
        "valor": 2
    },
    { 
        "codigo":"salgado",
        "descricao": "salgado",
        "valor": 7.25
    },
    { 
        "codigo": "combo1",
        "descricao": "1 suco e 1 sanduiche",
        "valor": 9.25
    },
    { 
        "codigo": "combo2",
        "descricao": "1 cafe e 1 sanduiche",
        "valor": 7.50
    },
];

jsonExtras = [
    {
        "codigo":"chantily",
        "dependente":"cafe",
    },
    {
        "codigo":"queijo",
        "dependente":"sanduiche",
    }
];
codigosItensExtra = ["chantily", "queijo"];

metodosDePag = ["dinheiro", "credito", "debito"];


    calcularValorDaCompra(metodoDePagamento, itens) {

        const validarPagamento = this.validarMetodoDePagamento(metodoDePagamento);
        if(validarPagamento) {
            return validarPagamento;
        }

        const validarCompra = this.validarCompra(itens);
        if(validarCompra) {
            return validarCompra;
        }
        let total  = 0;
        for(let itemPedido of itens) {
            let parcial = this.calcularValorDoItem(itemPedido);
            total += parcial;
        }

        return this.calcularValorFinal(metodoDePagamento,total);
    };



    validarMetodoDePagamento(formaDePagamento) {
        if(!this.metodosDePag.includes(formaDePagamento)) {
            return "Forma de pagamento inválida!";
        }
        return null;
    };


    validarCompra(itensCompra) {
        if(!itensCompra || !itensCompra.length) {
            return "Não há itens no carrinho de compra!";
        }

        for(let item of itensCompra) {
            let i = item.split(",");
            let codigo = i[0];
            let quantidade = parseInt(i[1]);

            if(quantidade <= 0) {
                return "Quantidade inválida!";
            }

            let buscarItem = this.jsonCardapio.some(item => item.codigo === codigo);
            if(!buscarItem) {
                return "Item inválido!"
            }
        }

        if(!this.validarItemExtra(itensCompra)) {
            return "Item extra não pode ser pedido sem o principal";
        }
   
        return null;
    };


    validarItemExtra(itensCompra) {
        let itensParaValidacao = [];
        for(let item of itensCompra) {
            let i = item.split(",");
            let itemExtra = i[0];
            if(this.codigosItensExtra.includes(itemExtra)) {
                itensParaValidacao.push(itemExtra);
                }
        }

                
        let itensPrincipais = [];
        for(let item of this.jsonExtras) {
            if(itensParaValidacao.includes(item.codigo)) {
                itensPrincipais.push(item.dependente);
            }
        }
        
        for(let itemPrincipal of itensPrincipais) {
            let validaItem = false;
            for(let pedido of itensCompra) {
                let i = pedido.split(",");
                let codigoItem = i[0];
                if(codigoItem === itemPrincipal) {
                    validaItem = true;
                }
            }
            if(validaItem === false) {
                return false;
            }
        }                           
        return true;
    };

    calcularValorDoItem(item) {
        let i = item.split(",");
        let codigo = i[0];
        let quantidade = parseInt(i[1]);

        for(let item of this.jsonCardapio) {
            if(item.codigo === codigo) {
                return item.valor * quantidade;
            }
        }
    }

    calcularValorFinal(metodoDePagamento, total) {
        let valorTotal = parseFloat(total);

        if(metodoDePagamento === "dinheiro") {
            return "R$ " + (0.95 * valorTotal).toFixed(2).replace(/\./g, ",");
        } else if (metodoDePagamento === "credito") {
            return "R$ " + (1.03 * valorTotal).toFixed(2).replace(/\./g, ",");
        } else {
            return "R$ " + (valorTotal).toFixed(2).replace(/\./g, ",");
        }
    
    }
    
};

export { CaixaDaLanchonete };

// DESCONTOS E TAXAS
// - Pagamento em dinheiro tem 5% de desconto
// - Pagamento a crédito tem acréscimo de 3% no valor total
// OUTRAS REGRAS
// - Caso item extra seja informado num pedido que não tenha o respectivo item principal, apresentar mensagem "Item extra não pode ser pedido sem o principal".
// - Combos não são considerados como item principal.
// - É possível pedir mais de um item extra sem precisar de mais de um principal.
// OK - Se não forem pedidos itens, apresentar mensagem "Não há itens no carrinho de compra!"
// OK - Se a quantidade de itens for zero, apresentar mensagem "Quantidade inválida!".
// OK - Se o código do item não existir, apresentar mensagem "Item inválido!"
// OK - Se a forma de pagamento não existir, apresentar mensagem "Forma de pagamento inválida!