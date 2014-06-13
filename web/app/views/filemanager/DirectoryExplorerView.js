define(['jquery',
        'underscore',
        'marionette',
        'text!views/filemanager/templates/directory-explorer.html',
        'text!views/filemanager/templates/directory-item.html'], function(
        $,
        _,
        Marionette,
        directoryExplorerTpl,
        directoryItemTpl) {

    var DirectoryItemView = Marionette.ItemView.extend({
        template: _.template(directoryItemTpl),
        tagName: 'tr',

        triggers: {
            'click .filename': 'filename:click'
        },

        bindings: {
            '.filename': 'filename',
            '.timestamp': {
                observe: 'mtime',
                onGet: function(val, options) {
                    return moment.unix(val).format('llll');
                }
            },
            '.size': {
                observe: 'size',
                onGet: function(val, options) {
                    return val ? filesize(val, true) : '';
                }
            },
            'i': {
                attributes: [{
                    name: 'class',
                    observe: 'mode',
                    onGet: function(val, options) {
                        return 'icon_mode M' + val;
                    }
                }]
            }
        },

        onRender: function() {
            this.stickit();
        }
    });

    return Marionette.CompositeView.extend({
        template: _.template(directoryExplorerTpl),
        tagName: 'table',
        className: 'directory-explorer table-striped',
        itemView: DirectoryItemView,
        itemViewContainer: 'tbody',

        events: {
            'click th.column-filename': 'onSortByName',
            'click th.column-mtime': 'onSortByModified',
            'click th.column-size': 'onSortBySize'
        },

        collectionEvents: {
            'sort': 'render toggleSortCaret'
        },

        initialize: function(options) {
            this.listenTo(this, 'itemview:filename:click', this.onFilenameClick);
        },

        close: function() {
        },

        onFilenameClick: function(itemView) {
            var dirObject = itemView.model
            if(dirObject.get('mode') === 16877) {
                this.model.appendPath(dirObject.get('filename'));
            } else {
                this.trigger('filemanager:file:click', itemView.model, this.model.get('path'));
            }
        },

        onSortByModified: function() {
            var sortDirection = (this.collection.sortDirection === 'DSC') ? 'ASC': 'DSC';
            this.collection.sort({sortProperty: 'mtime', sortDirection: sortDirection});
        },

        onSortByName: function() {
            var sortDirection = (this.collection.sortDirection === 'DSC') ? 'ASC': 'DSC';
            this.collection.sort({sortProperty: 'filename', sortDirection: sortDirection});
        },

        onSortBySize: function() {
            var sortDirection = (this.collection.sortDirection === 'DSC') ? 'ASC': 'DSC';
            this.collection.sort({sortProperty: 'size', sortDirection: sortDirection});
        },

        toggleSortCaret: function() {
            var direction = (this.collection.sortDirection === 'ASC') ? 'up' : 'down';
            this.$('th.column-' + this.collection.sortProperty + ' i').hide();
            this.$('th.column-' + this.collection.sortProperty + ' i').attr('class', 'icon-caret-' + direction).show();
        }

    });
});