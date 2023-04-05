const addVariantToCart = ( ) => {
let cartButtonsContainer = document.querySelectorAll('#cartAdjustment');
    Array.from(cartButtonsContainer)
        .map((container) => {
       return Array.from(container.children).flat();
    }).forEach((container) => {
        container.forEach((element) => {
            const propertyField = container[0].querySelector('#size');
            const findButtons = {
                'addToCart': element,
                'remove': element,
                'addProp': element,
                'cartAttribute': element,
            };
        
            const buttons = findButtons[element.attributes[0].value];
            buttons?.addEventListener('click', (e) => {
                console.log('testing');
                variantRequest(e.target, propertyField.value);
            }, false);
        
        })
    })
}

const variantRequest = (element, value) => {
    const data = element.attributes[1].value;
    const param = {
        attributes: {
            product: 'hi',
        }
    };

    param[data] = 1;
    const mapUrl = {
        'addToCart': {
            endpoint: 'cart/add.js',
            request: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'items': [
                        {
                            id: data,
                            'quantity': 1
                        },
                    ]
                }),
            },
        },
        'remove': {
            endpoint: 'cart.js',
            request: {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        },
        'addProp': {
            endpoint: 'cart/add.js',
            request: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'items': [
                        {
                            id: data,
                            'quantity': 1,
                            'properties': {
                                'product': value
                            }
                        },
                    ]
                }),
            },
        },
        'cartAttribute': {
            endpoint: 'cart/update.js',
            request: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(param)
            }
        }
    };


    const url = window.Shopify.routes.root + mapUrl[element.attributes[0].value].endpoint;

    const request = mapUrl[element.attributes[0].value].request;

    fetch(url, request).then((data) => {
        console.log(data.json());
        return data.json();
    })
    .then((result) => {
        if (element.attributes[0].value !== 'remove') {
            return;
        }

        const items = result.items.filter((item) => item.id == data);
        const url = window.Shopify.routes.root + 'cart/change.js';

        items.forEach((item) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'id': item.key,
                    quantity: 0
                })
            }).then((response) => {
                console.log(response);
            })
        });
    })
    .catch((err) => {
        console.log(err);
    })
  };

addVariantToCart();

