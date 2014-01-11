define(function (require_browser) {
    var App = require_browser('App'),
        DirectoryContents = require_browser('collections/DirectoryContents').DirectoryContents;

    describe('DirectoryContents - Collection', function() {

        describe('sort', function() {
            var directoryContents;
            var sampleData = [{
                filename: 'one-file.jpg',
                size: 434343,
                mtime: 1360468126   // 2/9/2013 7:48:46 PM
            },{
                filename: 'sample-file.png',
                size: 100000,
                mtime: 1366266020   // 4/17/2013 11:20:20 PM
            },{
                filename: 'a-first-file.ini',
                size: 444444,
                mtime: 1378969110   // 9/11/2013 11:58:30 PM
            },{
                filename: 'z-last-file.config',
                size: 999999,
                mtime: 1330970070   // 3/5/2012 9:54:30 AM
            }];

            beforeEach(function() {
                directoryContents = new DirectoryContents(sampleData, {server: {}});
            });

            afterEach(function() {
                directoryContents.reset([], {silent: true});
            });

            it('triggers onSort when data is sorted', function() {
                var sortEventSpy = sinon.spy();
                directoryContents.on('sort', sortEventSpy);

                sortEventSpy.should.not.have.been.called;
                directoryContents.sort({sortProperty: 'mtime'});
                sortEventSpy.should.have.been.called;
                (sortEventSpy.args[0][1]['sortProperty']).should.equal('mtime');
            });

            it('default sorts by filename (ASC)', function() {
                (directoryContents.first().get('filename')).should.equal('a-first-file.ini');
                (directoryContents.last().get('filename')).should.equal('z-last-file.config');
            });

            it('sorts by file size (ASC) and (DSC)', function() {
                directoryContents.sort({sortProperty: 'size'});
                (directoryContents.first().get('size')).should.equal(100000);
                (directoryContents.last().get('size')).should.equal(999999);

                directoryContents.sort({sortProperty: 'size'});
                (directoryContents.first().get('size')).should.equal(999999);
                (directoryContents.last().get('size')).should.equal(100000);
            });

            it('sorts by modified time (ASC) and (DSC)', function () {
                directoryContents.sort({sortProperty: 'mtime'});
                (directoryContents.first().get('mtime')).should.equal(1330970070);
                (directoryContents.last().get('mtime')).should.equal(1378969110);

                directoryContents.sort({sortProperty: 'mtime'});
                (directoryContents.first().get('mtime')).should.equal(1378969110);
                (directoryContents.last().get('mtime')).should.equal(1330970070);
            });

            it('correctly toggles sort direction on repeat sorts of the same property', function() {
                (directoryContents.sortDirection).should.equal('ASC');

                directoryContents.sort({sortProperty: 'mtime'});
                (directoryContents.sortDirection).should.equal('ASC');

                directoryContents.sort({sortProperty: 'mtime'});
                (directoryContents.sortDirection).should.equal('DSC');

                directoryContents.sort({sortProperty: 'mtime'});
                (directoryContents.sortDirection).should.equal('ASC');
            });

        });
    });
});