describe("ForDirective", function () {

    it("render list, data fill before attach", function () {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');

        expect(lis.length).toBe(4);
        expect(lis[2].getAttribute('title')).toBe('varsha');
        expect(lis[2].innerHTML.indexOf('varsha - wangshuonpu@163.com')).toBe(0);
        expect(lis[1].getAttribute('title')).toBe('errorrik');
        expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("render list use s-, data fill before attach", function () {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li s-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');

        expect(lis.length).toBe(4);
        expect(lis[2].getAttribute('title')).toBe('varsha');
        expect(lis[2].innerHTML.indexOf('varsha - wangshuonpu@163.com')).toBe(0);
        expect(lis[1].getAttribute('title')).toBe('errorrik');
        expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("render list, no data", function () {
        var MyComponent = san.defineComponent({
            template: '<ul><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></ul>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');

        expect(lis.length).toBe(0);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("render list, no data, push soon", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                    persons: []
                };
            },

            template: '<ul><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></ul>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');

        expect(lis.length).toBe(0);

        myComponent.data.push('persons',
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        );

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(1);
            expect(lis[0].getAttribute('title')).toBe('otakustay');
            expect(lis[0].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("render list, push soon, no strange node in page", function (done) {
        var MyComponent = san.defineComponent({
            initData: function () {
                return {
                    persons: [{name: 'errorrik', email: 'errorrik@gmail.com'}]
                };
            },

            template: '<ul style="margin:0;padding:0;border:0;list-style:none"><li style="margin:0;padding:0;border:0;height:22px" san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></ul>'
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis[0].getAttribute('title')).toBe('errorrik');
        expect(lis[0].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);
        expect(lis.length).toBe(1);

        var itemHeight = lis[0].offsetHeight;
        expect(lis[0].parentNode.offsetHeight).toBe(itemHeight);


        myComponent.data.push('persons',
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        );

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(2);
            expect(lis[1].getAttribute('title')).toBe('otakustay');
            expect(lis[1].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            expect(lis[0].parentNode.offsetHeight).toBe(itemHeight * 2);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data push after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[2].getAttribute('title')).toBe('varsha 2/2');

        myComponent.data.push('persons',
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        );

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(5);
            expect(lis[2].getAttribute('title')).toBe('varsha 2/3');
            expect(lis[3].getAttribute('title')).toBe('otakustay 3/3');
            expect(lis[3].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data push after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><ul san-for="col in cols">'
                + '<li san-for="item in col.list" title="{{item.title}}">{{item.title}}</li>'
                + '</ul></div>',

            initData: function () {
                return {
                    cols: [
                        {list: []}
                    ]
                };
            }
        });

        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(0);

        myComponent.data.push('cols[0].list', {title: 'title'});

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(1);
            expect(lis[0].title).toBe('title');
            expect(myComponent.data.get('cols[0].list[0].title')).toBe('title');


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data pop after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('errorrik 1/2');

        myComponent.data.pop('persons');

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(3);
            expect(lis[1].getAttribute('title')).toBe('errorrik 1/1');
            expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data unshift after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'one', email: 'one@gmail.com'},
            {name: 'two', email: 'two@gmail.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('one 1/2');
        expect(lis[1].innerHTML.indexOf('one - one@gmail.com')).toBe(0);

        myComponent.data.unshift('persons',
            {name: 'three', email: 'three@gmail.com'}
        );

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(5);

            expect(lis[3].getAttribute('title')).toBe('two 3/3');
            expect(lis[3].innerHTML.indexOf('two - two@gmail.com')).toBe(0);
            expect(lis[2].getAttribute('title')).toBe('one 2/3');
            expect(lis[1].getAttribute('title')).toBe('three 1/3');
            expect(lis[1].innerHTML.indexOf('three - three@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data shift after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('errorrik 1/2');
        expect(lis[2].getAttribute('title')).toBe('varsha 2/2');

        myComponent.data.shift('persons');

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(3);
            expect(lis[1].getAttribute('title')).toBe('varsha 1/1');
            expect(lis[1].innerHTML.indexOf('varsha - wangshuonpu@163.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data remove after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'one', email: 'one@gmail.com'},
            {name: 'two', email: 'two@gmail.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('one 1/2');
        expect(lis[1].innerHTML.indexOf('one - one@gmail.com')).toBe(0);

        myComponent.data.removeAt('persons', 0);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(3);
            expect(lis[1].getAttribute('title')).toBe('two 1/1');
            expect(lis[1].innerHTML.indexOf('two - two@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data splice after attach, just remove", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'one', email: 'one@gmail.com'},
            {name: 'two', email: 'two@gmail.com'},
            {name: 'three', email: 'three@gmail.com'},
            {name: 'four', email: 'four@gmail.com'},
            {name: 'five', email: 'five@gmail.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(7);
        expect(lis[1].getAttribute('title')).toBe('one 1/5');
        expect(lis[2].getAttribute('title')).toBe('two 2/5');

        myComponent.data.splice('persons', [1, 3]);


        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(4);
            expect(lis[1].getAttribute('title')).toBe('one 1/2');
            expect(lis[2].getAttribute('title')).toBe('five 2/2');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data splice after attach, remove and insert", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'one', email: 'one@gmail.com'},
            {name: 'two', email: 'two@gmail.com'},
            {name: 'three', email: 'three@gmail.com'},
            {name: 'four', email: 'four@gmail.com'},
            {name: 'five', email: 'five@gmail.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(7);
        expect(lis[1].getAttribute('title')).toBe('one 1/5');
        expect(lis[2].getAttribute('title')).toBe('two 2/5');

        myComponent.data.splice('persons', [
            1, 3,
            {name: 'six', email: 'six@gmail.com'},
            {name: 'seven', email: 'seven@gmail.com'}
        ]);


        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(6);
            expect(lis[1].getAttribute('title')).toBe('one 1/4');
            expect(lis[2].getAttribute('title')).toBe('six 2/4');
            expect(lis[3].getAttribute('title')).toBe('seven 3/4');
            expect(lis[4].getAttribute('title')).toBe('five 4/4');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data set after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}} {{i+1}}/{{persons.length}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('errorrik 1/2');

        myComponent.data.set('persons[0]', {name: 'erik', email: 'erik168@163.com'});

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(4);
            expect(lis[1].getAttribute('title')).toBe('erik 1/2');
            expect(lis[1].innerHTML.indexOf('erik - erik168@163.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });


    it("data set after attach, for in tr should warning parent(tbody) in chrome", function (done) {
        // dont run this spec in ie
        if (/msie/i.test(navigator.userAgent)) {
            done();
            return;
        }

        var MyComponent = san.defineComponent({
            template: '<div><table><thead><tr><th>name</th><th>email</th></tr></thead>' +
                '<tbody><tr title="{{p.name}}" san-for="p,i in persons"><td>{{p.name}}</td><td>{{p.email}}</td></tr></tbody></table></div>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'firede', email: 'firede@gmail.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var trs = wrap.getElementsByTagName('tr');
        expect(trs.length).toBe(3);

        myComponent.data.set('persons', [
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        ]);

        san.nextTick(function () {
            var trs = wrap.getElementsByTagName('tr');
            expect(trs.length).toBe(2);
            expect(trs[1].getAttribute('title')).toBe('otakustay');

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data item set after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);

        myComponent.data.set('persons[0].name', 'erik');

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(4);
            expect(lis[1].getAttribute('title')).toBe('erik');
            expect(lis[1].innerHTML.indexOf('erik - errorrik@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data set after attach(has two side sibling)", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(4);

        myComponent.data.set('persons', [
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        ]);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(3);
            expect(lis[1].getAttribute('title')).toBe('otakustay');
            expect(lis[1].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data set after attach(has last sibling, no first sibling)", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'any', email: 'anyone@163.com'}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(3);

        myComponent.data.set('persons', [
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        ]);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(2);
            expect(lis[0].getAttribute('title')).toBe('otakustay');
            expect(lis[0].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data set after attach(has last sibling, no first sibling, start with empty data)", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(1);

        myComponent.data.set('persons', [
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        ]);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(2);
            expect(lis[0].getAttribute('title')).toBe('otakustay');
            expect(lis[0].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("data item set after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}} in {{org}}</li><li>name - email</li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com'},
            {name: 'varsha', email: 'wangshuonpu@163.com'}
        ]);
        myComponent.data.set('org', 'efe');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');

        expect(lis.length).toBe(4);
        expect(lis[1].getAttribute('title')).toBe('errorrik');
        expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com in efe')).toBe(0);

        myComponent.data.set('org', 'MMSFE');

        san.nextTick(function () {
            expect(lis[1].getAttribute('title')).toBe('errorrik');
            expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com in MMSFE')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("no data before attach, data set after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}</li></ul>'
        });
        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(0);

        myComponent.data.set('persons', [
            {name: 'otakustay', email: 'otakustay@gmail.com'}
        ]);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');
            expect(lis.length).toBe(1);
            expect(lis[0].getAttribute('title')).toBe('otakustay');
            expect(lis[0].innerHTML.indexOf('otakustay - otakustay@gmail.com')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("multi data set after attach, that will influence exists item which should be removed", function (done) {
        var MyComponent = san.defineComponent({
            template: '<div><a san-for="item, index in list" title="{{dep}} {{item.name}}">{{dep}} {{item.name}}</a></div>'
        });
        var myComponent = new MyComponent({
            data: {
                list: [
                    {name: 'one'},
                    {name: 'two'}
                ],
                dep: 'dep'
            }
        });

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var aEls = wrap.getElementsByTagName('a');

        expect(aEls.length).toBe(2);
        expect(aEls[0].getAttribute('title')).toBe('dep one');
        expect(aEls[0].innerHTML.indexOf('dep one')).toBe(0);
        expect(aEls[1].getAttribute('title')).toBe('dep two');
        expect(aEls[1].innerHTML.indexOf('dep two')).toBe(0);

        myComponent.data.set('list', [
            {name: 'three'}
        ]);
        myComponent.data.set('dep', 'DEPT');

        san.nextTick(function () {
             var aEls = wrap.getElementsByTagName('a');

            expect(aEls.length).toBe(1);
            expect(aEls[0].getAttribute('title')).toBe('DEPT three');
            expect(aEls[0].innerHTML.indexOf('DEPT three')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });
    });

    it("nested, data fill before attach", function () {
        var MyComponent = san.defineComponent({
            template: '<ul><li>name - email</li><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}<b san-for="tel in p.tels">{{tel}}</b></li></ul>'
        });
        var myComponent = new MyComponent();
        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com', tels: ['12345678', '87654321']},
            {name: 'varsha', email: 'wangshuonpu@163.com', tels: ['23456789', '98765432']}
        ]);

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');

        expect(lis.length).toBe(3);

        expect(lis[2].getAttribute('title')).toBe('varsha');
        expect(lis[2].innerHTML.indexOf('varsha - wangshuonpu@163.com')).toBe(0);
        var lis2bs = lis[2].getElementsByTagName('b');
        expect(lis2bs[0].innerHTML.indexOf('23456789')).toBe(0);
        expect(lis2bs[1].innerHTML.indexOf('98765432')).toBe(0);

        expect(lis[1].getAttribute('title')).toBe('errorrik');
        expect(lis[1].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);
        var lis1bs = lis[1].getElementsByTagName('b');
        expect(lis1bs[0].innerHTML.indexOf('12345678')).toBe(0);
        expect(lis1bs[1].innerHTML.indexOf('87654321')).toBe(0);

        myComponent.dispose();
        document.body.removeChild(wrap);
    });

    it("nested, data fill after attach", function (done) {
        var MyComponent = san.defineComponent({
            template: '<ul><li san-for="p,i in persons" title="{{p.name}}">{{p.name}} - {{p.email}}<b san-for="tel in p.tels">{{tel}}</b></li></ul>'
        });
        var myComponent = new MyComponent();


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis.length).toBe(0);

        myComponent.data.set('persons', [
            {name: 'errorrik', email: 'errorrik@gmail.com', tels: ['12345678', '87654321']},
            {name: 'varsha', email: 'wangshuonpu@163.com', tels: ['23456789', '98765432']}
        ]);

        san.nextTick(function () {
            var lis = wrap.getElementsByTagName('li');

            expect(lis[1].getAttribute('title')).toBe('varsha');
            expect(lis[1].innerHTML.indexOf('varsha - wangshuonpu@163.com')).toBe(0);
            var lis2bs = lis[1].getElementsByTagName('b');
            expect(lis2bs[0].innerHTML.indexOf('23456789')).toBe(0);
            expect(lis2bs[1].innerHTML.indexOf('98765432')).toBe(0);

            expect(lis[0].getAttribute('title')).toBe('errorrik');
            expect(lis[0].innerHTML.indexOf('errorrik - errorrik@gmail.com')).toBe(0);
            var lis1bs = lis[0].getElementsByTagName('b');
            expect(lis1bs[0].innerHTML.indexOf('12345678')).toBe(0);
            expect(lis1bs[1].innerHTML.indexOf('87654321')).toBe(0);

            myComponent.dispose();
            document.body.removeChild(wrap);

            done();
        });

    });


    it("use index to refer other object", function () {
        var MyComponent = san.defineComponent({
            template: '<ul><li san-for="p,i in persons" title="{{colors[i]}}">{{colors[i]}}</li></ul>',
            initData: function () {
                return {
                    persons: [
                        {name: 'errorrik', email: 'errorrik@gmail.com'}
                    ],

                    colors: ['red']
                }
            }
        });
        var myComponent = new MyComponent();


        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var lis = wrap.getElementsByTagName('li');
        expect(lis[0].title).toBe('red');

        myComponent.dispose();
        document.body.removeChild(wrap);

    });

    it("dom event in for", function (done) {
        var clickValue = 0;
        var MyComponent = san.defineComponent({
            template: '<ul><li san-for="p in list" on-click="clicker(p)">{{p}}</li></ul>',
            initData: function () {
                return {
                    list: [1, 2, 3]
                };
            },

            clicker: function (p) {
                clickValue = p;
            }
        });

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        expect(clickValue).toBe(0);

        var lis = wrap.getElementsByTagName('li');
        triggerEvent('#' + lis[0].id, 'click');

        san.nextTick(function () {
            expect(clickValue > 0).toBeTruthy();


            myComponent.dispose();
            document.body.removeChild(wrap);
            done();
        });

    });

    it("component custom event in for", function (done) {
        var clickValue = [];
        var Button = san.defineComponent({
            template: '<button><slot></slot></button>',

            attached: function () {
                this.fire('click');
            }
        });

        var MyComponent = san.defineComponent({
            template: '<p><ui-button san-for="p in list" on-click="clicker(p)">{{p}}</ui-button></p>',
            initData: function () {
                return {
                    list: [1, 2, 3]
                };
            },

            components: {
                'ui-button': Button
            },

            clicker: function (p) {
                clickValue.push(p);
            }
        });


        expect(clickValue.length).toBe(0);

        var myComponent = new MyComponent();
        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);


        expect(clickValue.length).toBe(3);
        expect(clickValue[0]).toBe(1);
        expect(clickValue[1]).toBe(2);
        expect(clickValue[2]).toBe(3);

        myComponent.dispose();
        document.body.removeChild(wrap);
        done();

    });

});
