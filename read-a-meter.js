/*
about delete see http://demos.jquerymobile.com/1.4.5/swipe-list/
*/

// *** Types ***

function Entry (id, type, value, date) {
  this.id = id;
  this.type = type;
  this.value = value;
  this.date = date;
}

Entry.prototype.li = function() {
  var li = $('<li>'),
      liContent = $('<a href="#">'),
      liContentType = $('<p class="meter-type"><strong>'+ this.type +'</strong></p>'),
      liContentValue = $('<p class="meter-value"><strong>'+ this.value +'</strong></p>'),
      liContentDateTime = $('<p class="ui-li-aside"><strong>'+ this.date.toLocaleString() +'</strong></p>');
  li.attr("id", this.id);
  liContent.append(liContentType);
  liContent.append(liContentValue);
  liContent.append(liContentDateTime);
  li.append(liContent);
  li.append('<a href="#" class="delete">Delete</a>');
  return li;
}

// *** Global variables ***

var entries;

// *** Functions ***

function refreshList () {
  $( "#list" ).empty();
  $.each(entries, function ( entry_index, entry_value ) {
    var entry = new Entry(entry_value.id, entry_value.type, entry_value.value, new Date(entry_value.date));
    $( "#list" ).prepend(entry.li());
  });
  $( "#list" ).listview("refresh");
}

// *** Events ***

$( document ).ready(function () {
  entries = JSON.parse( window.localStorage.getItem( "entries" ) );
  if ( entries == null ) entries = [];
  refreshList();
});

$( document ).on( "pagecreate", "#main-page", function() {

  // *** NEW ***
  
  $( "#meter-new-btn ").on( "click", function () {
    $( "#meter-new-popup" ).popup( "open" );
  });
  
  $( "#meter-new-ok" ).on( "click", function () {
  	 var meterId = "meter-id-" + new Date().getTime(), // TODO: UUID?
        meterType = $(" #meter-new-type input:checked ").val(),
  	     meterValue = $(" #number-pattern ").val(),
  	     meterDate = new Date(),
  	     entry = new Entry(meterId, meterType, meterValue, meterDate);
    entries.push(entry);
    refreshList();
    window.localStorage.setItem("entries", JSON.stringify(entries));
  });

  // *** DELETE ***

  // Swipe to remove list item
  if ( $.mobile.support.touch ) {
    $( document ).on( "swipeleft swiperight", "#list li", function( event ) {
      var listitem = $( this ),
          // These are the classnames used for the CSS transition
          dir = event.type === "swipeleft" ? "left" : "right",
          // Check if the browser supports the transform (3D) CSS transition
          transition = $.support.cssTransform3d ? dir : false;
          confirmAndDelete( listitem, transition );
    });
  } else {
    // If it's not a touch device...
    // Remove the class that is used to hide the delete button on touch devices
    $( "#list" ).removeClass( "touch" );
    // Click delete split-button to remove list item
    $( document ).on( "click", "#list li .delete", function( event ) {
      var listitem = $( this ).parent( "li" );
      confirmAndDelete( listitem );
    });
  }

  function confirmAndDelete( listitem, transition ) {
    var index = $( "#list li" ).index(listitem);
  	
    // Highlight the list item that will be removed
    listitem.children( ".ui-btn" ).addClass( "ui-btn-active" );
    // Inject topic in confirmation popup after removing any previous injected topics
    $( "#confirm .meter-type" ).remove();
    $( "#confirm .meter-value" ).remove();
    listitem.find( ".meter-value" ).clone().insertAfter( "#question" );
    listitem.find( ".meter-type" ).clone().insertAfter( "#question" );
    // Show the confirmation popup
    $( "#confirm" ).popup( "open" );
    // Proceed when the user confirms
    $( "#confirm #confirm-delete-yes" ).on( "click", function() {
      // Remove with a transition
      if ( transition ) {
        listitem
          // Add the class for the transition direction
          .addClass( transition )
          // When the transition is done...
          .on( "webkitTransitionEnd transitionend otransitionend", function() {
            // ...the list item will be removed
            entries = $.grep( entries, function ( e ) {
              return e.id != listitem.attr( "id" );
            });
            listitem.remove();
             window.localStorage.setItem("entries", JSON.stringify(entries));
            // ...the list will be refreshed and the temporary class for border styling removed
            $( "#list" ).listview( "refresh" ).find( ".border-bottom" ).removeClass( "border-bottom" );
          })
          // During the transition the previous button gets bottom border
          .prev( "li" ).children( "a" ).addClass( "border-bottom" )
          // Remove the highlight
          .end().end().children( ".ui-btn" ).removeClass( "ui-btn-active" );
      }
      // If it's not a touch device or the CSS transition isn't supported just remove the list item and refresh the list
      else {
        entries = $.grep( entries, function ( e ) {
          return e.id != listitem.attr( "id" );
        });
        listitem.remove();
        window.localStorage.setItem("entries", JSON.stringify(entries));
        $( "#list" ).listview( "refresh" );
      }
    });
    // Remove active state and unbind when the cancel button is clicked
    $( "#confirm #confirm-delete-cancel" ).on( "click", function() {
      listitem.children( ".ui-btn" ).removeClass( "ui-btn-active" );
      $( "#confirm #confirm-delete-yes" ).off();
    });
  }
  
});
