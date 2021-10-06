// Were going to create a helper that helps us format the date
// A JavaScript date library for parsing, validating, manipulating, and formatting dates.
const moment = require('moment');

module.exports = {
    formatDate: function (date,format){
        return moment(date).format(format)
    },
    // Cuts out to the length we want it to be + adding three dots
    truncate: function (str, len) {
        if (str.length > len && str.length > 0) {
          let new_str = str + ' '
          new_str = str.substr(0, len)
          new_str = str.substr(0, new_str.lastIndexOf(' '))
          new_str = new_str.length > 0 ? new_str : str.substr(0, len)
          return new_str + '...'
        }
        return str
      },
      // takes in an input - takes out any html tags
      stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '')
      }, 
      
      editIcon: function (storyUser, loggedUser, storyId, floating = true) {
        if (storyUser._id.toString() == loggedUser._id.toString()) {
          if (floating) {
            return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
          } else {
            return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
          }
        } else {
          return ''
        }
      },
      // The guy even found it on stackoverflow about handlebars- didndt know how to
      // need to register this in app.js
      select: function (selected, options) {
        return options
          .fn(this)
          .replace(
            new RegExp(' value="' + selected + '"'),
            '$& selected="selected"'
          )
          .replace(
            new RegExp('>' + selected + '</option>'),
            ' selected="selected"$&'
          )
      },
}