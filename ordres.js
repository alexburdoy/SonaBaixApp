$(document).ready(function(){

    const database = firebase.database();
    const beforeCartQuery = database.ref('ordres/');

    beforeCartQuery.on('value',function success(data){
        if(data){

            let orders = '';
            $.each(data.val(),function(key,value){
                let orderNumber = key,
                orderPrice = value.total,
                totalProducts = value.products,
                table = value.table;

                orders+= `
                <div class="card bgOrder p-3 m-1" id=${key}>
                        <div class="orderTable">Taula ${table}</div>
                        `;

                $.each(totalProducts,function(key,value){
                    orders+=`
                    <div class="orderItem">${value.item} | ${value.price}</div>                    
                    `

                });
                orders+=`
                <div class="orderPrice">Preu Comanda: ${parseFloat(orderPrice).toFixed(2)} €</div>
                <div data-id=${key} class="confirmaComandaDone p-2"><img src="img/tick.png" width="24"></div>
                    
                </div >`
            });
            $('.appendOrders').html(orders);

            $('.confirmaComandaDone').click(function(){
                let thekey = $(this).data('id');
                beforeCartQuery.child(thekey).remove();
            });
        }
    })
}); 