var pre = "ndefined_cart_";
var paypalAddress = "snow@countrybulkbarn.com";
var Cart = function(){
  this.items = [];
  this.zip = "";
  this.idCount = 0;
  this.totalPrice = 0;
  this.allTotal = 0;
  this.totalWeight = 0;
  this.totalQuantity = 0;
  this.shippingCost = 15.00;
  this.totalItemName = "";
  var that = this;
  //create new UI
  var source   = $("#ndefined-cartlayout").html();
  var bodyTemplate = Handlebars.compile(source);
  //totalItemCount, shipping, subtotal, total
  var context = {totalItemCount: "0", shipping: "$0.00", subtotal: "$0.00", total: "$0.00", items: "<li>Your cart is empty!</li>"}
  var html    = bodyTemplate(context);
  $("body").append(html);
  $('#'+pre+'body header').click(function(){
    $('#'+pre+'content').toggle();
  });
  $('#'+pre+'zip').change(function(){
    that.setzip($(this).val());
  });
  $('#'+pre+'content').toggle();
  $("#"+pre+"checkout_now").click(function(){
    that.checkout();
  });
};

Cart.prototype.setzip = function(z){
    if(this.checkzip(z)){
      this.zip = z;
      this.updateShipping();
    }
    else{
        if(this.zip != ""){
            alert('Invalid zip code, please try again.');
        }
    }
};
Cart.prototype.updateShipping = function(){
    var that = this;
    if(this.totalQuantity < 1){
        return false;
    }
    if(this.zip === ""){
        alert("Please enter a zip code.");
        return;
    }
    $.get("zee.php?z="+this.zip+"&s=1&w="+this.totalWeight, function(data){
        if(data != ""){
            this.shippingCost = data;
            $("#"+pre+"shipping_est ."+pre+"shipping").text(accounting.formatMoney(data));
            that.allTotal = (that.totalPrice) + (data * 1);
            $('#'+pre+'content .'+pre+'subtotal').html(accounting.formatMoney(that.totalPrice) + "<br><div class='breaker'>" + accounting.formatMoney(that.allTotal) + "</div>");
        }else{
            //Default shipping loaded.
        }

    });
      
};
Cart.prototype.addItem = function(i){
  if(this.items.length < 1){
    $('.'+pre+'items li').remove();
  }
  var itemTotalPrice= 0 
  var itemTotalWeight = 0;
  
  //Add item to cart, unless it exists, then modify it's qunatity.
  var k = this.findItemKey(i);
  var tempQuantity = 0;
  var update = false;
  if(k !== false){
    tempQuantity = i.quantity;
    i = this.items[k];
    i.quantity = i.quantity + tempQuantity;
    update = true;
  }else{
    i.ID = this.idCount++;
    this.items.push(i);
  }
  this.updateItems(update);
};
Cart.prototype.updateItems = function(update){
  //Calculate updates...
  $('#'+pre+'content').show();
  var that = this;
  var source, itemTemplate, itemTemplate, html
  this.totalPrice = 0;
  this.totalWeight = 0;
  this.totalQuantity = 0;
  this.totalItemName = "";
  for(var c = 0; c < this.items.length; c++){
    i = this.items[c];
    itemTotalPrice = i.price * i.quantity;
    itemTotalWeight = i.weight * i.quantity;
    this.totalPrice = this.totalPrice + itemTotalPrice;
    this.totalWeight = this.totalWeight + itemTotalWeight;
    this.totalItemName = this.totalItemName + i.name + " x "+ i.quantity + " ("+ itemTotalWeight + " lbs)" + ", ";
    this.totalQuantity = this.totalQuantity + (i.quantity*1);
    if(update || $('#'+pre+'q_'+i.ID).val() > 0){
      $('#'+pre+'q_'+i.ID).val(i.quantity);
      $('#'+pre+'item_'+i.ID+'_price').text(accounting.formatMoney(itemTotalPrice));
      $('#'+pre+'item_wieght_'+i.ID).text('('+itemTotalWeight+' lbs)');
    }
    else{
        source   = $("#ndefined-item").html();
        itemTemplate = Handlebars.compile(source);
        //itemID, itemName, itemWeight, itemTotalWeight, itemTotalPrice
        context = {itemID: i.ID, itemName: i.name, itemQuantity: i.quantity,  itemWeight: i.weight, itemTotalWeight: itemTotalWeight, itemTotalPrice: accounting.formatMoney(itemTotalPrice)}
        html    = itemTemplate(context);
        $('#'+pre+'body .'+pre+'items').append(html);
      $('#'+pre+'item_'+i.ID+' .'+pre+'remove').click(function(){
        var itemElement = $(this).attr("data");
        that.removeItem(itemElement);
        $('#'+pre+'item_'+itemElement).remove();
      });
      $('#'+pre+'q_'+i.ID).keyup(function(){
        var val = $(this).val();
        if(val == ""){ return; }
        var ie = $(this).attr("data");
        if(val > 0){
          var k = that.findItemKeyById(ie);
          that.items[k].quantity = val;
          that.updateItems(false);
        }else{
          that.removeItem(ie);
          $('#'+pre+'item_'+ie).remove();
        }
      });
    }
  }
  //Add to the UI
  $('#'+pre+'totalItems').text('('+this.totalQuantity+')');
  $('#'+pre+'body .'+pre+'subtotal').text(accounting.formatMoney(this.totalPrice));
  if(this.zip != "" && this.totalQuantity > 0){
    this.updateShipping();
  }
}

Cart.prototype.checkzip = function(z){
  //Check zipcode
  var re = new RegExp("\\d{5}(-\\d{4})?");
  return re.exec(z);
}

Cart.prototype.checkout = function(){
        console.log("gothere");
        source   = $("#ndefined-checkout").html();
        itemTemplate = Handlebars.compile(source);
        //itemName, itemPrice, paypal
        context = {paypal: paypalAddress, itemName: this.totalItemName + 'UPS/USPS Ground Shipping included.', itemPrice: this.allTotal}
        html    = itemTemplate(context);
        $('#'+pre+'checkout').append(html);
        $('#'+pre+'checkout').toggle();
    
};
Cart.prototype.removeItem = function(i){
    var k = this.findItemKeyById(i);
    this.items.splice(k, 1);
    this.updateItems(false);
};

Cart.prototype.findItemKey = function(i){
  for(var a = 0; a < this.items.length; a++){
      if(this.items[a].name == i.name){
          return a;
      }
  }
  return false;
}
Cart.prototype.findItemKeyById = function(id){
  for(var a = 0; a < this.items.length; a++){
      if(this.items[a].ID == id){
          return a;
      }
  }
  return false;
}