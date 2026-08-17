/* =====================================================
   CONFIGURATION
===================================================== */

// ⚠️ À remplacer par le vrai numéro WhatsApp du vendeur
// Format international sans + ni espaces
const WHATSAPP_NUMBER = "2250576412313";


/* =====================================================
   PRODUITS DE LA MAQUETTE
===================================================== */

const products = [

    {
        id: 1,
        name: "Poudre de Moringa",
        category: "Poudres",
        price: 5000,
        unit: "100 g",
        icon: "🌿",
        badge: "Bestseller"
    },

    {
        id: 2,
        name: "Poudre de Moringa",
        category: "Poudres",
        price: 8500,
        unit: "250 g",
        icon: "🌱",
        badge: "Nouveau"
    },

    {
        id: 3,
        name: "Huile de Moringa",
        category: "Huiles",
        price: 7500,
        unit: "100 ml",
        icon: "🫒",
        badge: ""
    },

    {
        id: 4,
        name: "Huile de Moringa",
        category: "Huiles",
        price: 12000,
        unit: "250 ml",
        icon: "🌿",
        badge: ""
    },

    {
        id: 5,
        name: "Infusion Moringa",
        category: "Infusions",
        price: 4500,
        unit: "20 sachets",
        icon: "🍵",
        badge: "Nouveau"
    },

    {
        id: 6,
        name: "Thé Moringa Nature",
        category: "Infusions",
        price: 6000,
        unit: "50 g",
        icon: "🍃",
        badge: ""
    },

    {
        id: 7,
        name: "Pack Découverte",
        category: "Poudres",
        price: 15000,
        unit: "3 produits",
        icon: "🎁",
        badge: "Populaire"
    },

    {
        id: 8,
        name: "Moringa Premium",
        category: "Poudres",
        price: 10000,
        unit: "300 g",
        icon: "🌿",
        badge: ""
    }

];


/* =====================================================
   VARIABLES
===================================================== */

let cart = JSON.parse(
    localStorage.getItem("moringa-cart") || "[]"
);

let activeCategory = "Tous";


/* =====================================================
   OUTILS
===================================================== */

const $ = (selector) =>
    document.querySelector(selector);


const money = (number) =>
    new Intl.NumberFormat("fr-FR")
        .format(number) + " FCFA";


const saveCart = () => {

    localStorage.setItem(
        "moringa-cart",
        JSON.stringify(cart)
    );

};


const cartCount = () => {

    return cart.reduce(
        (total, item) => total + item.qty,
        0
    );

};


const cartTotal = () => {

    return cart.reduce(
        (total, item) =>
            total + item.price * item.qty,
        0
    );

};


/* =====================================================
   ANIMATION AU SCROLL
===================================================== */

const revealObserver =
    new IntersectionObserver(

        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.15
        }

    );


/*
    Active les animations sur les éléments
    déjà présents dans le HTML.
*/

function initScrollAnimations() {

    document
        .querySelectorAll(
            ".reveal, .reveal-left, .reveal-right"
        )
        .forEach(element => {

            revealObserver.observe(element);

        });

}


/* =====================================================
   AFFICHER LES PRODUITS
===================================================== */

function renderProducts() {

    const search =
        $("#searchInput")
            .value
            .toLowerCase()
            .trim();


    const filteredProducts =
        products.filter(product => {

            const matchesCategory =
                activeCategory === "Tous" ||
                product.category === activeCategory;


            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search);


            return (
                matchesCategory &&
                matchesSearch
            );

        });


    if (filteredProducts.length === 0) {

        $("#productGrid").innerHTML = `
            <p style="
                grid-column:1/-1;
                color:var(--muted);
            ">
                Aucun produit trouvé.
            </p>
        `;

        return;

    }


    /*
        Génération des cartes produits
    */

    $("#productGrid").innerHTML =

        filteredProducts.map(
            (product, index) => `

            <article
                class="product-card reveal"
                style="--animation-delay: ${index * 0.08}s;"
            >

                ${
                    product.badge
                    ?
                    `
                    <span class="badge">
                        ${product.badge}
                    </span>
                    `
                    :
                    ""
                }


                <div class="product-img">

                    ${product.icon}

                </div>


                <div class="product-info">

                    <small>

                        ${product.category}

                        •

                        ${product.unit}

                    </small>


                    <h3>

                        ${product.name}

                    </h3>


                    <div class="price">

                        ${money(product.price)}

                    </div>


                    <button
                        class="add-btn"
                        data-add="${product.id}"
                    >

                        Ajouter au panier

                    </button>

                </div>

            </article>

        `

        ).join("");


    /*
        Observer les nouvelles cartes
        pour déclencher leur animation.
    */

    document
        .querySelectorAll(
            "#productGrid .reveal"
        )
        .forEach(card => {

            card.style.transitionDelay =
                card.style
                    .getPropertyValue(
                        "--animation-delay"
                    );

            revealObserver.observe(card);

        });


    /*
        Boutons Ajouter au panier
    */

    document
        .querySelectorAll("[data-add]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    addToCart(
                        Number(
                            button.dataset.add
                        )
                    );

                }
            );

        });

}


/* =====================================================
   AJOUTER AU PANIER
===================================================== */

function addToCart(productId) {

    const product =
        products.find(
            product =>
                product.id === productId
        );


    if (!product) {

        return;

    }


    const existing =
        cart.find(
            item =>
                item.id === productId
        );


    if (existing) {

        existing.qty++;

    }

    else {

        cart.push({

            ...product,

            qty: 1

        });

    }


    saveCart();

    renderCart();

    openCart();

}


/* =====================================================
   AFFICHER LE PANIER
===================================================== */

function renderCart() {

    $("#cartCount").textContent =
        cartCount();


    $("#cartTotal").textContent =
        money(cartTotal());


    $("#cartEmpty").style.display =
        cart.length
        ? "none"
        : "block";


    $("#cartItems").innerHTML =

        cart.map(item => `

            <div class="cart-row">

                <div class="cart-thumb">

                    ${item.icon}

                </div>


                <div>

                    <strong>

                        ${item.name}

                    </strong>


                    <small>

                        ${money(item.price)}

                        •

                        ${item.unit}

                    </small>


                    <div class="qty">

                        <button
                            data-minus="${item.id}"
                        >

                            −

                        </button>


                        <b>

                            ${item.qty}

                        </b>


                        <button
                            data-plus="${item.id}"
                        >

                            +

                        </button>

                    </div>

                </div>


                <button
                    class="remove"
                    data-remove="${item.id}"
                >

                    Suppr.

                </button>

            </div>

        `).join("");


    /*
        Boutons -
    */

    document
        .querySelectorAll("[data-minus]")
        .forEach(button => {

            button.onclick = () => {

                changeQuantity(
                    Number(
                        button.dataset.minus
                    ),
                    -1
                );

            };

        });


    /*
        Boutons +
    */

    document
        .querySelectorAll("[data-plus]")
        .forEach(button => {

            button.onclick = () => {

                changeQuantity(
                    Number(
                        button.dataset.plus
                    ),
                    1
                );

            };

        });


    /*
        Boutons supprimer
    */

    document
        .querySelectorAll("[data-remove]")
        .forEach(button => {

            button.onclick = () => {

                removeFromCart(
                    Number(
                        button.dataset.remove
                    )
                );

            };

        });

}


/* =====================================================
   MODIFIER QUANTITÉ
===================================================== */

function changeQuantity(
    productId,
    difference
) {

    const item =
        cart.find(
            item =>
                item.id === productId
        );


    if (!item) {

        return;

    }


    item.qty += difference;


    if (item.qty <= 0) {

        cart =
            cart.filter(
                item =>
                    item.id !== productId
            );

    }


    saveCart();

    renderCart();

}


/* =====================================================
   SUPPRIMER
===================================================== */

function removeFromCart(productId) {

    cart =
        cart.filter(
            item =>
                item.id !== productId
        );


    saveCart();

    renderCart();

}


/* =====================================================
   OUVRIR / FERMER PANIER
===================================================== */

function openCart() {

    $("#cartPanel")
        .classList
        .add("open");


    $("#overlay")
        .classList
        .add("show");

}


function closeCart() {

    $("#cartPanel")
        .classList
        .remove("open");


    $("#overlay")
        .classList
        .remove("show");

}


$("#cartBtn").onclick =
    openCart;


$("#closeCart").onclick =
    closeCart;


$("#overlay").onclick =
    closeCart;


/* =====================================================
   CHECKOUT
===================================================== */

$("#checkoutBtn").onclick = () => {

    if (cart.length === 0) {

        alert(
            "Votre panier est vide."
        );

        return;

    }


    $("#checkoutModal")
        .classList
        .add("show");

};


/* =====================================================
   FERMER MODAL
===================================================== */

$("#closeModal").onclick = () => {

    $("#checkoutModal")
        .classList
        .remove("show");

};


/* =====================================================
   FORMULAIRE WHATSAPP
===================================================== */

$("#checkoutForm").onsubmit =
    (event) => {

        event.preventDefault();


        if (cart.length === 0) {

            alert(
                "Votre panier est vide."
            );

            return;

        }


        const name =
            $("#customerName")
                .value
                .trim();


        const phone =
            $("#customerPhone")
                .value
                .trim();


        const city =
            $("#customerCity")
                .value
                .trim();


        const country =
            $("#customerCountry")
                .value
                .trim();


        const address =
            $("#customerAddress")
                .value
                .trim();


        const email =
            $("#customerEmail")
                .value
                .trim();


        /*
            Produits
        */

        const productLines =
            cart.map(item => {

                const subtotal =
                    item.price * item.qty;


                return (
                    `• ${item.name} × ${item.qty}` +
                    ` — ${money(subtotal)}`
                );

            }).join("\n");


        /*
            Email optionnel
        */

        const emailLine =
            email
            ? `📧 Email : ${email}`
            : `📧 Email : Non renseigné`;


        /*
            Message WhatsApp
        */

        const message =

`Bonjour Les Vertus de Moringa 👋

Je souhaite passer une commande :

🛍️ PRODUITS

${productLines}

💰 TOTAL
${money(cartTotal())}

👤 INFORMATIONS CLIENT

Nom : ${name}
📞 Téléphone : ${phone}
📍 Ville : ${city}
🌍 Pays : ${country}
🏠 Adresse : ${address}
${emailLine}

Merci !`;


        /*
            Création du lien WhatsApp
        */

        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}` +
            `?text=${encodeURIComponent(
                message
            )}`;


        /*
            Ouvrir WhatsApp
        */

        window.open(
            whatsappURL,
            "_blank"
        );

    };


/* =====================================================
   FILTRES
===================================================== */

document
    .querySelectorAll(".filter")
    .forEach(button => {

        button.onclick = () => {

            document
                .querySelectorAll(".filter")
                .forEach(btn =>
                    btn.classList.remove(
                        "active"
                    )
                );


            button.classList.add(
                "active"
            );


            activeCategory =
                button.dataset.category;


            renderProducts();

        };

    });


/* =====================================================
   RECHERCHE
===================================================== */

$("#searchInput").oninput =
    renderProducts;


/* =====================================================
   MENU MOBILE
===================================================== */

$("#menuBtn").onclick = () => {

    $("#nav")
        .classList
        .toggle("open");

};


document
    .querySelectorAll(".nav a")
    .forEach(link => {

        link.onclick = () => {

            $("#nav")
                .classList
                .remove("open");

        };

    });


/* =====================================================
   MODE SOMBRE
===================================================== */

$("#themeBtn").onclick = () => {

    document.body
        .classList
        .toggle("dark");


    const isDark =
        document.body
            .classList
            .contains("dark");


    $("#themeBtn").textContent =
        isDark
        ? "☀"
        : "☾";


    localStorage.setItem(
        "moringa-theme",
        isDark
        ? "dark"
        : "light"
    );

};


/*
    Restaurer le thème
*/

if (
    localStorage.getItem(
        "moringa-theme"
    ) === "dark"
) {

    document.body
        .classList
        .add("dark");


    $("#themeBtn").textContent =
        "☀";

}


/* =====================================================
   CONTACT WHATSAPP
===================================================== */

$("#contactWhatsapp").href =
    `https://wa.me/${WHATSAPP_NUMBER}` +
    `?text=${encodeURIComponent(
        "Bonjour Les Vertus de Moringa 👋 J'aimerais avoir des informations sur vos produits."
    )}`;


/* =====================================================
   INITIALISATION
===================================================== */

renderProducts();

renderCart();

initScrollAnimations();