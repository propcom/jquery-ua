# Universal Analytics wrapper

## How to use

#### Step 1

Include `jquery.ua.min.js` or `jquery.ua.js` library on your website.

#### Step 2

Update your HTML to include required `classes` and `data attributes` (details below).

#### Step 3

Initialiaze with your GA tracking code - e.g. `UA.init("UA-12341234-1")`

#### Step 4

Collect and send all the data to Google.

##### on page load:
```
UA.sendImpressions();
UA.sendProductActions();
UA.sendPageview();
```

##### on signle events:

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

