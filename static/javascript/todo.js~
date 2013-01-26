var TodoItem = Backbone.Model.extend({});

//define view to show todo - render todoitem to html element

var TodoView = Backbone.View.extend({
    render: function (){
        var html = '<h3>' + this.model.get('description') + '</h3>';
        $(this.el).html(html);
    }

});

//var todoItem = new TodoItem({description:'I want to complete backbone tutorial today', status: 'incomplete', id:1});
var todoItem = new TodoItem({});
todoItem.url = '/getdata';
todoItem.fetch({
    success: function() {
        // fetch successfully completed
        console.log('success  :',todoItem.toJSON());
    },
    error: function() {
        console.log('Failed to fetch!');
    }
    });
//todoItem.save();

var todoView = new TodoView({model:todoItem});
todoView.render();
console.log(todoView.el);
