// ==UserScript==
// @name         PT - full story life cycle
// @version      0.2
// @description  track stories to PR and to deploy
// @match        https://www.pivotaltracker.com/s/projects/*
// @author       Karlotcha Hoa
// ==/UserScript==

setTimeout( function(){
// **************************************************************************
// PT models
// **************************************************************************
var project      = tracker.Project.current()
  , stories      = project.stories()
  , labels       = project.labels()
  , label_merge  = labels.findByName('needs merge')
  , label_deploy = labels.findByName('needs deploy')
  , label_live   = labels.findByName('live')

// **************************************************************************
// buttons
// **************************************************************************
$("body").delegate('.button.accept','click', function(){
  var cid   = $(this).parents().filter('.story').data('cid')
    , story = stories.get(cid)
  story.labels().add(label_merge)
})

$("body").delegate('.button.merged','click', function(){
  var cid   = $(this).parents().filter('.story').data('cid')
    , story = stories.get(cid)
  $(this).parents().filter('header').find('.label:contains("needs merge")').remove()
  $(this).remove()
  story.labels().remove(label_merge)
  story.labels().add(label_deploy)
  story.save(story.changed)
})

$("body").delegate('.button.deployed','click', function(){
  var cid   = $(this).parents().filter('.story').data('cid')
    , story = stories.get(cid)
  $(this).parents().filter('header').find('.label:contains("needs deploy")').remove()
  $(this).remove()
  story.labels().remove(label_deploy)
  story.labels().add(label_live)
  story.save(story.changed)
})

// **************************************************************************
// main loop
// **************************************************************************
function main(){
  var $states_merge = $('.accepted .label:contains("needs merge")')
                        .parents()
                        .filter('header')
                        .find('span.state')

  $states_merge.each(function(){
    var state = $(this)
    if (state.find('.merged').length == 0)
      state.append('<label class="state button merged" tabindex="-1">Merged</label>')
  })

  var $states_deploy = $('.accepted .label:contains("needs deploy")')
                         .parents()
                         .filter('header')
                         .find('span.state')

  $states_deploy.each(function(){
    var state = $(this)
    if (state.find('.deployed').length == 0)
      state.append('<label class="state button deployed" tabindex="-1">Live</label>')
  })
}

for (var i = 1; i<10; i=i+2) setTimeout(main, i*1000)
setInterval(main, 60000)
$('body').click(function(){setTimeout(main, 1000)})

// **************************************************************************
// style
// **************************************************************************
var $style = $('<style></style>')
$style.attr('type', 'text/css')
      .append('.button.merged { color: #eee; background-color: #470047; border-color: #470047; }')
      .append('.button.deployed { color: #eee; background-color: #003D00; border-color: #003D00; }')
$('head').append($style)
}, 10000);