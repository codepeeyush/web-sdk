# Shopify Co-Pilot

# YourGPT Shopify AI Actions Documentation


## Overview

This documentation covers the integration of YourGPT AI Copilot with your Shopify store. It enables the Copilot to perform AI Actions in Shopify, allowing customers to search products, view details, add items to cart, and navigate the store using natural language commands.

## Table of Contents

1. `Initial Setup`
2. `Action Functions`
3. `Helper Functions`
4. `Configuration`

## Initial Setup

## Step 1: Create Your Shopify Store

Set up your Shopify store through the Shopify admin panel.

<img width="1920" height="1080" alt="Admin page shopify" src="https://github.com/user-attachments/assets/178ea39e-b96b-4a02-b903-f85338d99078" />


## Step 2: Access Theme Code Editor

1. Navigate to your Shopify admin
2. Go to **Online Store** > **Themes**
3. Click the **3 dots** menu on your active theme
4. Select **Edit code**

<img width="1920" height="1080" alt="Edit code" src="https://github.com/user-attachments/assets/d445f37e-90d8-47d0-ba1f-3a26e472ba2a" />

## Step 3: Modify theme.liquid

1. Open the `theme.liquid` file from the **Layout** folder
2. Add the following code before the closing `</body>` tag:

```jsx
<script>
window.YGC_WIDGET_ID = "YOUR_WIDGET_ID";
(function () {
    var script = document.createElement("script");
    script.src = "https://widget.yourgpt.ai/script.js";
    script.id = "yourgpt-chatbot";
    document.body.appendChild(script);

    script.onload = function () {
        console.log("Instance:", $yourgptChatbot);
        setupChatbotAIActions();
    }
})();
</script>
```

**Note:** Replace `YOUR_WIDGET_ID` with your actual YourGPT widget ID.

## Action Functions

## 1. Product Search (`ai:action:find_product`)

**Purpose:** Searches for products based on user queries and redirects to search results.

**Functionality:**

- Takes a search query from the user
- Sends request to Shopify search API
- Parses HTML response to extract product information
- Converts product titles to URL-friendly slugs
- Redirects user to search results page
    
  <img width="1920" height="1080" alt="Find products" src="https://github.com/user-attachments/assets/a07e53de-419c-463c-9781-5d0b0f26d3e4" />

    

```jsx
$yourgptChatbot.on("ai:action:find_product", async function (data, action) {
    const query = data.action.tool.function.arguments;
    const query_data = JSON.parse(query);
    let url = `https://mystorecvxvxcv.myshopify.com/search?q=${query_data.q}&options%5Bprefix%5D=last`;

    const response = await fetch(url);
    const html = await response.text();

    const parser = new DOMParser();
    const document = parser.parseFromString(html, 'text/html');
    const productList = document.querySelector('ul.product-grid.product-grid--template--24764995371287__main.product-grid--grid');
    const slugs = [];

    if (productList) {
        const productListItems = productList.querySelectorAll('li');
        productListItems.forEach(listItem => {
            const potentialTitleElements = listItem.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a');
            for (const titleElement of potentialTitleElements) {
                const titleText = titleElement.textContent.trim();
                if (titleText.length > 0 && !titleText.toLowerCase().includes('add')) {
                    const slug = titleText.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    slugs.push(slug);
                    break;
                }
            }
        });
    } else {
        action.respond("No Product Found!");
        return;
    }

    if (slugs.length < 1) {
        return action.respond("No Product Found!");
    }

    function arrayToString(arr) {
        return arr.join(' ');
    }
    const result = arrayToString(slugs);
    action.respond(`I found these products you were searching for ${result}`);
    window.location.href = url;
});
```

## 2. Show All Products (`ai:action:show_products`)

**Purpose:** Displays all available products in the store.

**Functionality:**

- Redirects user to the "all products" collection page
- Provides confirmation message

<img width="1920" height="1080" alt="Show all products" src="https://github.com/user-attachments/assets/d9ff8f04-9fa3-42cf-9fed-f23d8c51d231" />


```jsx
$yourgptChatbot.on("ai:action:show_products", async function (data, action) {
    let base_url = 'https://mystorecvxvxcv.myshopify.com';
    window.location.href = `${base_url}/collections/all`;
    action.respond("Here is the result");
});
```

## 3. View Product Details (`ai:action:view_product`)

**Purpose:** Navigates to a specific product's detail page.

**Functionality:**

- Scans current page for product links
- Matches user query with available product slugs
- Redirects to the most similar product's detail page
<img width="1920" height="1080" alt="View product" src="https://github.com/user-attachments/assets/6fb3fa89-4a10-49f2-bc28-e587bd034280" />


```jsx
$yourgptChatbot.on("ai:action:view_product", function (data, action) {
    let all_slug = [];
    const links = document.querySelectorAll('a[href*="/products/"]');
    links.forEach(link => {
        const href = link.href;
        const slug = href.split('/products/')[1];
        all_slug.push(slug);
    });

    const query = data.action.tool.function.arguments;
    const query_data = JSON.parse(query);
    const result = findMostSimilar(query_data.q, all_slug);

    if (result == null) {
        return action.respond("No Product Found To Add!");
    }
    const url = `https://mystorecvxvxcv.myshopify.com/products/${result}`;
    window.location.href = url;
    return action.respond(`Here is the product details page`);
});
```

## 4. Add to Cart (`ai:action:add_to_cart`)

**Purpose:** Adds products to the shopping cart with variant selection support.

**Functionality:**

- Identifies products based on user query
- Handles variant selection (color, size, etc.)
- Adds products to cart via form submission or API
- Supports both simple and complex product variants
    
 <img width="1920" height="1080" alt="Add to cart" src="https://github.com/user-attachments/assets/46fc3fcb-3f8f-4473-8939-f85bf296fd3d" />


```jsx
$yourgptChatbot.on("ai:action:add_to_cart", async function (data, action) {
    let all_slug = [];
    const links = document.querySelectorAll('a[href*="/products/"]');
    links.forEach(link => {
        const href = link.href;
        const slug = href.split('/products/')[1];
        all_slug.push(slug);
    });

    const query = data.action.tool.function.arguments;
    const query_data = JSON.parse(query);

    let product_options = getOptionsAsURLParams();
    if (product_options.length > 1 && !query_data.color && !query_data.size) {
        return action.respond(`Kindly choose which variant you want to add to your cart ${product_options}`);
    }

    const result = findMostSimilar(query_data.q, all_slug);
    if (result == null) {
        return action.respond("No product found!");
    }

    let variantId = result?.split("variant=")[1];

    if (query_data.color && query_data.size) {
        async function selectOptionsSequentially(size, color) {
            selectOption('size', size);
            await new Promise(r => setTimeout(r, 200));
            selectOption('color', color);
        }
        await selectOptionsSequentially(query_data.size, query_data.color);

        let updated_url = window.location.href;
        variantId = updated_url.split("variant=")[1].split("#")[0];

        const result = await addToCart(variantId);
        if (result.success) {
            window.location.href = 'https://mystorecvxvxcv.myshopify.com/cart';
            return action.respond("Product added to cart");
        } else {
            return action.respond("Failed to add to cart!");
        }
    }

    const variantInput = document.querySelector(`input[name="id"][value="${variantId}"]`);

    if (variantInput) {
        const form = variantInput.closest('form');
        if (form) {
            const addButton = form.querySelector('button[name="add"]') ||
                form.querySelector('button.add-to-cart-button') ||
                form.querySelector('button[type="submit"]');
            if (addButton) {
                addButton.click();
                return action.respond("Product Added To Cart");
            }
        }
    } else {
        let response = await increaseQuantityViaAPI(result);
        if (!response) {
            return action.respond("Failed to add the Product or Product not exists!");
        }
        action.respond("Quantity is Increased");
    }
});
```

## 5. Filter Products by Price (`ai:action:product_with_filter`)

**Purpose:** Filters products based on price range criteria.

**Functionality:**

- Accepts minimum and maximum price parameters
- Constructs filtered collection URL
- Redirects to filtered product listing
<img width="1920" height="1080" alt="Filter products" src="https://github.com/user-attachments/assets/fe0dbd9a-9563-4bc9-a591-39a6cce45a6e" />


```jsx
$yourgptChatbot.on("ai:action:product_with_filter", function (data, action) {
    const query = data.action.tool.function.arguments;
    const query_data = JSON.parse(query);
    const url = `https://mystorecvxvxcv.myshopify.com/collections/all?filter.v.price.gte=${query_data.min ? query_data.min : 0}.00&filter.v.price.lte=${query_data.max ? query_data.max : 999}.00&sort_by=title-ascending&grid=default`;
    window.location.href = url;
    action.respond("Here is your products.");
});
```

## 6. Open Checkout (`ai:action:open_checkout`)

**Purpose:** Initiates the checkout process for items in the cart.

**Functionality:**

- Validates cart contents before checkout
- Redirects to checkout page if cart has items
- Provides appropriate messaging for empty carts

```jsx
$yourgptChatbot.on("ai:action:open_checkout", async function (data, action) {
    try {
        const cartResponse = await fetch('/cart.js');
        const cart = await cartResponse.json();

        if (cart.items && cart.items.length > 0) {
            action.respond("Opening checkout page...");
            setTimeout(() => {
                window.location.href = 'https://mystorecvxvxcv.myshopify.com/checkout';
            }, 1000);
        } else {
            action.respond("Your cart is empty. Please add items before checkout.");
        }
    } catch (error) {
        action.respond("Opening checkout page...");
        setTimeout(() => {
            window.location.href = 'https://mystorecvxvxcv.myshopify.com/checkout';
        }, 1000);
    }
});
```

## Helper Functions

## Find Most Similar (`findMostSimilar`)

**Purpose:** Intelligently matches user queries with available product slugs using fuzzy matching algorithms.

**Features:**

- Handles partial, misspelled, or loosely worded queries
- Normalizes input by handling hyphens and spaces
- Filters out common stop words
- Implements scoring system for match quality
- Supports exact phrase matching and partial word matching

```jsx
function findMostSimilar(query, items) {
    if (!query || !items || items.length === 0) return null;

    *// Normalize query - handle both hyphens and spaces*
    const normalizedQuery = query.toLowerCase().replace(/-/g, " ").trim();

    *// Clean the query - extract key product words*
    const queryWords = normalizedQuery
        .split(" ")
        .map((word) => word.trim())
        .filter(
            (word) =>
                word.length > 0 &&
                !["open", "show", "find", "get", "view", "the", "a", "an"].includes(
                    word,
                ),
        );

    if (queryWords.length === 0) return null;

    let bestMatch = null;
    let bestScore = 0;

    for (let item of items) {
        if (!item || typeof item !== "string") continue;

        *// Extract product name from slug (remove variants and params)*
        const productName = item
            .split("?")[0]
            .replace(/-/g, " ")
            .toLowerCase()
            .trim();

        let score = 0;

        *// Check for exact phrase match first (highest priority)*
        const queryPhrase = queryWords.join(" ");
        if (productName.includes(queryPhrase)) {
            score = 100;
        } else {
            *// Check for partial phrase matches*
            for (let i = 0; i < queryWords.length - 1; i++) {
                const partialPhrase = queryWords.slice(i, i + 2).join(" ");
                if (productName.includes(partialPhrase)) {
                    score += 50;
                }
            }

            *// Count individual matching words*
            let matchingWords = 0;
            queryWords.forEach((word) => {
                if (productName.includes(word)) {
                    matchingWords++;
                    score += 10;
                }
            });

            *// Bonus for matching all words (even if not as phrase)*
            if (matchingWords === queryWords.length) {
                score += 20;
            }
        }

        *// Only consider matches with at least one matching word*
        if (score > 0 && score > bestScore) {
            bestScore = score;
            bestMatch = item;
        }
    }

    return bestMatch;
}
```

**Scoring System:**

- Exact phrase match: 100 points
- Partial phrase match: 50 points per phrase
- Individual word match: 10 points per word
- All words matched: 20 bonus points

## Configuration

## Required Modifications

1. **Store URL**: Replace `https://mystorecvxvxcv.myshopify.com` with your actual Shopify store URL throughout all functions.
2. **Widget ID**: Replace `YOUR_WIDGET_ID` with your actual YourGPT widget ID.
3. **CSS Selectors**: Update CSS selectors in the `find_product` function to match your theme's structure:
    
    `javascriptconst productList = document.querySelector('ul.product-grid.product-grid--template--24764995371287__main.product-grid--grid');`
    

## Setup Function

Add this function to initialize all ai actions:

```jsx
function setupChatbotAIActions() {
    *// All the action functions go here// This function should be called after the chatbot script loads*
}
```

## Usage Examples

## Customer Interactions

1. **Product Search**
    - User: "Find red shoes"
    - Action: `ai:action:find_product` triggered
    - Result: Search results for red shoes displayed
2. **Add to Cart**
    - User: "Add blue t-shirt size medium to cart"
    - Action: `ai:action:add_to_cart` triggered
    - Result: Blue t-shirt in medium size added to cart
3. **Price Filtering**
    - User: "Show products under $50"
    - Action: `ai:action:product_with_filter` triggered
    - Result: Products filtered by price range
4. **Checkout**
    - User: "Proceed to checkout"
    - Action: `ai:action:open_checkout` triggered
    - Result: Checkout page opened (if cart has items)

## Best Practices

1. **Error Handling**: Always include try-catch blocks for API calls
2. **User Feedback**: Provide clear responses for all user actions
3. **Loading States**: Use timeouts for better user experience during redirects
4. **Validation**: Check cart contents and product availability before actions

## Troubleshooting

## Common Issues

1. **Products Not Found**: Check CSS selectors match your theme structure
2. **Cart Addition Fails**: Verify form selectors and button identifiers
3. **Redirects Not Working**: Ensure store URLs are correct
4. **Variant Selection Issues**: Check option selection logic and timing

## Debug Tips

- Use browser console to check for JavaScript errors
- Verify API responses using Network tab
- Test individual functions in isolation
- Check YourGPT widget configuration

This integration provides a comprehensive e-commerce AI Copilot experience, enabling customers to browse, search, and purchase products through natural language interactions.

## 📄 License
MIT License - see LICENSE file for details.

## 🆘 Support
- 📧 Email: support@yourgpt.ai
- 📖 Documentation: [Project Documentation](https://docs.yourgpt.ai)
- 💬 Discord: [Join our community](https://discord.com/invite/z8PBs5ckcd)

## 🔗 Links
- Website: [YourGPT](https://yourgpt.ai/)
- Documentation: [Project Documentation](https://docs.yourgpt.ai)

---

Made with ❤️ by YourGPT Team
