$(document).ready(function () {

    const database = firebase.database();
    const beforeQuery = database.ref('carta/');
    const beforeCartQuery = database.ref('ordres/');

    beforeQuery.on('value', function success(data) {
        if (data) {

            /* PRINT PRODUCTS ON SCREEN */
            let productes = '';
            $.each(data.val(), function (key, value) {
                let id = key,
                    item = value['item'],
                    price = value['price'];

                productes += `
                <div class="card bgCard p-3 m-1" id=${key}>
                    
                        <div class="item">${item}</div>
                        <div class="price" >${parseFloat(price).toFixed(2)} €</div>
                        <div data-id=${key} class="addCart p-2"><img src="img/shopping-cart.png" width="24"></div>
                    
                </div >
                `;
            });
            $('.productes').html(productes);


            /* ADD TO CART */
            $('.addCart').click(function () {
                let thekey = $(this).data('id');
                console.log(thekey);
                /*******/

                let item = $(`#${thekey} > .item`).text(),
                    price = $(`#${thekey} > .price`).text(),
                    slice = price.indexOf('0');
                price = price.slice(0, slice);
                console.log(item);
                console.log(price);

                let appendData = `<tr>
                <td class="cartTitle">${item}</td>
                <td class="cartPrice">${parseFloat(price).toFixed(2)} €</td>
                <td class="removeMe"><div class="removeIcon">X</div></td>

                </tr>`;
                $('.comanda').append(appendData);


            });


            /* TOGGLE PRODUCTS AND ORDER */
            $('.comandaToggle').click(function () {

                $('.comanda-container').slideToggle();
                $('.carta').slideToggle();


            });

            /* REMOVE FROM ORDER */
            $(document).on('click', '.removeMe', function () {
                $(this).parent().remove();
            });

            $(document).on('click', '.removeMe,.addCart', function () {
                total();
                let totalRows = $('.cartPrice').length,
                    itemCounter = $('.totalItems');
                itemCounter.fadeOut('slow', function () {
                    $(this).html(totalRows).fadeIn('slow');
                });
            });

            /* CALCULATE TOTAL PRICE */
            const total = () => {
                let allOrderProducts = $('.cartPrice'),
                    total = 0.00;
                //console.log(allOrderProducts);

                for (i = 0; i < allOrderProducts.length; i++) {
                    var getPrice = $('.cartPrice').eq(i).text();
                    console.log(getPrice)
                    total += parseFloat(getPrice);
                    console.log(total);
                }

                $('.total').text(`Total : ${parseFloat(total).toFixed(2)}€`);

                if(total > 1){
                    $('.demanaComanda').slideDown();
                }
                else{ $('.demanaComanda').slideUp();}
                return total;
            }

            /* SEND ORDER */

            $(document).on('click','.demanaComanda',function(){
                var table = $('#inputTable').val();
                console.log(table);
                var orderedItems = [];
                let totalRows = $('.cartPrice').length;

                if(!$('#inputTable').val()){
                    alert("Introdueix el teu número de taula");
                }
                else{
                    for (let i=0; i<totalRows;i++){
                        var items = {
                            item : $('.cartTitle').eq(i).text(),
                            price : $('.cartPrice').eq(i).text(),
                        }
                        orderedItems.push(items);
                    }
                    
                    let newId = beforeCartQuery.push();
                    newId.set({
                        products : orderedItems,
                        total: total(),
                        table : table
                    },
                    function(error){
                        if(!error){
                            $('.removeMe').click();
                            $('.comanda').append('<tr><td>Comanda realitzada :)</td></tr>');
                            setTimeout(function(){
                                $('.comandaToggle').click();
                            },2000);
                        }
                    }
                    )
                }

                
            });



        }
    });

});