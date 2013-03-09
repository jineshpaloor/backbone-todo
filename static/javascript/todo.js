(function(mynamespace){

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
        model: TodoItem,

        initialize: function(){
            this.on('remove', this.hideModel);
        },

        hideModel: function(model){
            model.trigger('hide');
        }
    });

    //define view to show todo - render todoitem to html element
    var TodoItemView = Backbone.View.extend({

        initialize: function(){
            this.model('hide', this.remove, this);
        },

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
            return this;
        },

        toggleStatus: function(){
            this.model.toggleStatus();
        },

        remove: function(){
            this.$el.remove();
        }

    });

    var TodoListView = Backbone.View.extend({

        initialize: function(){
            this.collection.on('add', this.addOne, this);
            this.collection.on('reset', this.addAll, this);
        },

        addOne: function(todoItem){
            var todoView = new TodoItemView({model: todoItem});
            this.$el.append(todoView.render().el);
        },

        addAll: function(){
            this.collection.forEach(this.addOne, this );
        },

        render: function(){
            console.log('rendering todolist view.....');
            this.addAll();
            return this;
        },

    });



    var todoList = new TodoList();

    var todos = [
        {description: 'Pick up milk.', status: 'incomplete'},
        {description: 'Get a car wash', status: 'incomplete'},
        {description: 'Learn Backbone', status: 'incomplete'}
    ];

    todoList.reset(todos);

    var todoListView = new TodoListView({collection: todoList});
    console.log('*************todo list view  :',todoListView);

    $("#todo-list").html(todoListView.render());

    mynamespace.TodoItem = TodoItem;
    mynamespace.TodoList = TodoList;
    mynamespace.TodoItemView = TodoItemView;
    mynamespace.TodoListView = TodoListView;
    mynamespace.todoList= todoList;
    mynamespace.todoListView = todoListView;

})(mynamespace);
