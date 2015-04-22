# Universal Analytics wrapper

## Quick start

#### Step 1

Include `jquery.ua.min.js` or `jquery.ua.js` library on your website.

#### Step 2

Update your HTML to include required `classes` and `data attributes` (details below).

#### Step 3

Initialiaze with your GA tracking code - e.g. `UA.init("UA-12341234-1")`

#### Step 4

Collect and send all the data to Google...

##### a) on page load (bulk):
```
UA.sendImpressions(); // ecommerce tracking
UA.sendProductActions(); // ecommerce tracking
UA.sendPageview(); // page views (you don't need this for ecommerce tracking only)
```

##### b) on signle events:

Can be useful when dealing with AJAX requests.
e.g.
```
$('.ua_addProduct a').on("click", function(e) {
  e.preventDefault();
  var $that = $(this);
  UA.sendSingleProductAction('click', $(this).parent(), function() {
    location.href = $that.attr('href');
  });
});
```

---

## Details

Enhanced Ecommerce tracking consists of:
- product impressions,
- product actions,
- promotion impression,
- promotion clicks.

[Original documentation...]
(https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce)


#### Product Impressions

Implement on any pages that show multiple products e.g. category, search.



```
<div
  class="ua_addImpression"
  data-product-id="6901"
  data-name="Product_01"
  data-category="Shoes"
  data-variant="Black"
  data-price="29.12"
  data-position="2"
>

...

<script>
  UA.sendImpressions();
</script>
```

The `sendImpressions` function expects elements with class `ua_addImpression`.

It sends the data in batches of 20 - [maximum payload request = 8192 bytes] (https://developers.google.com/analytics/devguides/collection/protocol/v1/reference).

Every processed impression gets postfix `-sent` appended - so it's safe to run the function multiple times e.g. when AJAX-injecting new products.


#### Product Actions


##### Bulk product actions

Implement on any pages that lead to a complete transaction, e.g. product page, basket, checkout.

```
<input type="hidden"
  class="ua_addProduct"
  data-ua-ec-actions="purchase"
  data-product-id="..."
  data-name="..."
  data-category="..."
  data-variant="..."
  data-price="..."
  data-quantity="..."
  data-action-id="..."
  data-revenue="..."
  data-tax="..."
  data-shipping="..."
/>

...

<script>
  UA.sendProductActions();
</script>
```


The `sendProductActions` function expects elements with class `ua_addProduct`.

Use `data-ua-ec-actions="..."` attribute to specify what action you want to track.
Possible values: `click, detail, add, remove, checkout, checkout_option, purchase, refund`.

All the other attributes is a mix of `actionFieldObject` and `productFieldObject` properties.
Refer to [original documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce) for details.

**NOTE!**
Both `actionFieldObject` and `productFieldObject` have `id` property.
Make sure to use **data-product-id** and **data-action-id** (not `data-id`).

Every processed product action gets postfix `-sent` appended - so it's safe to run the function multiple times e.g. when AJAX-injecting new products.


##### Single product actions

If required, single actions can be sent using:

`UA.sendSingleProductAction('<action_name>', <element_with_data_attributes>, [<callback()>])`.

Using this method doesn't rely on any classes. All you need is the data attributes.

Callback may be useful if you want to track an action just before redirecting to another page.

```
$('.ua_addProduct a').on("click", function(e) {
	e.preventDefault();
	var $that = $(this);
	UA.sendSingleProductAction('click', $(this).parent(), function() {
		location.href = $that.attr('href');
	});
});
```

---

#### Promotion Impressions

```
<input type="hidden"
	class="ua_addPromoImpression"
	data-id="PROMO1"
	data-name="Summer Sale"
	data-creative="banner A"
	data-position="1"
/>

...

<script>
  UA.sendPromoImpressions();
</script>
```

The `sendPromoImpressions` function expects elements with class `ua_addPromoImpression`.

Every processed impression gets postfix `-sent` appended - so it's safe to run the function multiple times.



#### Promotion Clicks

##### Bulk promotion cliks

```
<input type="hidden"
	class="ua_addPromoClick"
	data-id="PROMO1"
	data-name="Summer Sale"
	data-creative="banner A"
	data-position="1"
/>

...

<script>
  UA.sendPromoClicks();
</script>
```

The `sendPromoClicks` function expects elements with class `ua_addPromoClick`.

All attributes is a mix of `promoFieldObject` properties.
Refer to [original documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce) for details.

Every processed element action gets postfix `-sent` appended - so it's safe to run the function multiple times.


##### Single promotion clicks

If required, single clicks can be sent using:

`UA.sendSinglePromoClick(<element_with_data_attributes>, [<callback()>])`.

Using this method doesn't rely on any classes. All you need is the data attributes.

Callback may be useful if you want to track an action just before redirecting to another page.

```
$('.promoBanner').on("click", function(e) {
	e.preventDefault();
	var $that = $(this);
	UA.sendSinglePromoClick($that, function() {
		location.href = $that.attr('href');
	});
});
```

