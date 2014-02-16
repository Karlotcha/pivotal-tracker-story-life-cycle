// ==UserScript==
// @name         PT - full story life cycle - V2
// @version      2.3
// @description  track stories to PR and to deploy
// @match        https://www.pivotaltracker.com/n/projects/*
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

if (!label_merge)  label_merge  = labels.create({name:'needs merge'})
if (!label_deploy) label_deploy = labels.create({name:'needs deploy'})
if (!label_live)   label_live   = labels.create({name:'live'})

// **************************************************************************
// buttons
// **************************************************************************
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
// main loop - creating mandatory buttons
// **************************************************************************
function main(){
  //add a label 'needs merge' if not lived and not deployed
  project.stories().each(function(story){
    story_labels = story.labels()
    if (story_labels.any(label_live) || story_labels.any(label_deploy)) return
    story.labels().add(label_merge)
  })

  var $states_merge = $('.accepted .label:contains("needs merge")')
                        .parents()
                        .filter('header')
                        .find('span.state')

  $states_merge.each(function(){
    var $state = $(this)
    if ($state.find('.merged').length == 0)
      $state.append('<label class="state button merged" tabindex="-1">Merge</label>')

    // automatic merge if PR-merge comment found
    var cid = $state.parents().filter('.story').data('cid')
      , story = stories.get(cid)

    if (!story) return

    var comments = story.comments()
      , $button_merge = $state.find('.merged')

    comments.each(function(comment) {
      if (comment.get("commit_message") &&
          comment.get("commit_message").lastIndexOf("Merge pull request #") >= 0 &&
          $button_merge.length != 0)
        $button_merge.trigger("click")
    })
  })

  var $states_deploy = $('.accepted .label:contains("needs deploy")')
                         .parents()
                         .filter('header')
                         .find('span.state')

  $states_deploy.each(function(){
    var $state = $(this)
    if ($state.find('.deployed').length == 0)
      $state.append('<label class="state button deployed" tabindex="-1">Deploy</label>')
  })
}

setInterval(main, 1000)

// **************************************************************************
// style
// **************************************************************************
var $style = $('<style></style>')
$style.attr('type', 'text/css')
      .append('.button.merged { color: #eee; background-color: #470047; border-color: #470047; }')
      .append('.button.deployed { color: #eee; background-color: #003D00; border-color: #003D00; }')
$('head').append($style)
}, 10000);
