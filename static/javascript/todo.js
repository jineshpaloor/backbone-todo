$(function(){

    var TodoItem = Backbone.Model.extend({

        urlRoot: "/getdata",

        defaults: {
            description: 'My unedited todo...',
            status: 'incomplete'
        },

        toggleStatus: function(){
            if(this.get('status') === 'incomplete'){
                this.set({'status': 'complete'});
            }else{
                this.set({'status': 'incomplete'});
            }
            this.save();
        }

    });

    var TodoList = Backbone.Collection.extend({
        model: TodoItem
    });

    //define view to show todo - render todoitem to html element
    var TodoView = Backbone.View.extend({

        el: $('#todo-list'),

        events: {
            'change input': 'toggleStatus'
        },

        initialize: function (){
            this.render();
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
        },

        template: _.template('<h3 class="<%= status %>" >' +
            '<input type=checkbox ' +
            '<% if(status === "complete") print("checked") %>/>' +
            '<%= description %></h3>'),

        render: function(){
            var attributes = this.model.toJSON();
            this.$el.html(this.template(attributes));
        },

        toggleStatus: function(){
            this.model.toggleStatus();
        },

        remove: function(){
            this.$el.remove();
        }

    });

    var TodoListView = Backbone.View.extend({

        render: function(){
            this.collection.forEach(this.addOne, this );
        },

        addOne: function(todoItem){
            var todoView = new TodoView({model: todoItem});
            console.log('todo view  :',todoView);
            this.$el.append(todoView.render().el);
        }

    });



//    var todoItem = new TodoItem({id:5});
//    var todoView = new TodoView({model:todoItem});
    var todoList = new TodoList();

    var todos = [
        {description: 'Pick up milk.', status: 'incomplete'},
        {description: 'Get a car wash', status: 'incomplete'},
        {description: 'Learn Backbone', status: 'incomplete'}
    ];
    todoList.reset(todos);
    var todoListView = new TodoListView({collection: todoList});
    todoListView.render();


    //var todoItem = new TodoItem({description:'I want to complete backbone tutorial today', status: 'incomplete', id:1});
    //var todoItem1 = new TodoItem({id:1});
    //var doThing = function(){
    //    alert('change');
    //};
    //todoItem.on('change', doThing);
    //
    //todoItem.save({'a':'b'}, {silent: true});


    //todoItem.fetch({
    //    success: function() {
    //        // fetch successfully completed
    //        console.log('success  :',todoItem.toJSON());
    //    },
    //    error: function() {
    //        console.log('Failed to fetch!');
    //    }
    //});
    //
    //todoItem1.fetch({
    //    success: function() {
    //        // fetch successfully completed
    //        console.log('fetch id 1:',todoItem1.toJSON());
    //    },
    //    error: function() {
    //        console.log('Failed to fetch id 1!');
    //    }
    //});
    //
    //todoItem1.save({'aa':'bb'});
    //todoItem.destroy({success: function(model, response) {
    //    console.log('destroy...');
    //}, error:function(model, response){
    //    console.log('destroy...fail');
    //
    //}});
    //var todoView = new TodoView({model:todoItem});
    //todoView.render();
    //console.log(todoView.el);

    //trying save for model : eg from backbone.js site

    //Backbone.sync = function(method, model) {
    //  alert(method + ": " + JSON.stringify(model));
    //  model.id = 1;
    //};
    //
    //var book = new Backbone.Model({
    //  title: "The Rough Riders",
    //  author: "Theodore Roosevelt"
    //});
    //
    //book.save();
    //
    //console.log('before edit :',book);
    //
    //book.save({author: "Teddy"});
    //
    //console.log('after edit :',book);
    //
});
