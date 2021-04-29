$(document).ready(function () {

    const database = firebase.database();
    const beforeQuery = database.ref('carta/');


    $('[name=submit]').click(function (e) {
        e.preventDefault();
        const item = $('[name=item ]').val(),
            price = $('[name=price]').val(),
            newid = beforeQuery.push();

        console.log(item);
        console.log(price);

        if (!item || !price) {
            //notification('FillAll');
            alert("Omple tots els camps");
        }
        else {
            newid.set({
                item: item,
                price: price
            },
                function (error) {
                    if (!error) {
                        //notifications("Inserit correctament");
                        $('[name=item]').val("");
                        $('[name=price]').val("");
                    }
                    else { console.log('No Desat'); }
                }
            )
        }

    });

    beforeQuery.on('value', function success(data) {
        if (data) {
            let productes = '';
            $.each(data.val(), function (key, value) {
                let id = key,
                    item = value['item'],
                    price = value['price'];

                productes += `
                <div class="card bgCard p-3 m-1" id=${key}>
                <div class="card-body">
                <h5 class="card-title title">${item}</h5>
                <p class="card-text">${parseFloat(price).toFixed(2)} €</p>
                </div>
                <div class="row row-cols-1 row-cols-md-5 m-1">
                <div data-id=${key} class="delete p-2"><img src="img/delete.png" width="24"></div>
                
                </div>
                </div >
                `;
            });
            $('.productes').html(productes);

            $('.delete').click(function(){
                let thekey = $(this).data('id');
                beforeQuery.child(thekey).remove();
            });
        }
    });

});