var infoViewer = {
        template: document.querySelector('#template'),
        instanceTemplate: document.querySelector('#instance-template'),
        selectorTemplate: document.querySelector('#selector-template'),
        infoWrapper: document.querySelector('.color-info-wrapper'),
        removeOldInfoBlock: function () {
            this.infoBlock && this.infoWrapper.removeChild(this.infoBlock);
            this.infoBlock = null;
        },
        _displayColor: function (color) {
            this.infoBlock.querySelector('.color').textContent = color.toUpperCase();
        },
        _displayInstances: function (instances) {
            var instancesWrapper = this.infoBlock.querySelector('.instances');

            instances.forEach(item => {
                var instanceNode = this.instanceTemplate.querySelector('.instance').cloneNode(true),
                    selectorsWrapper = instanceNode.querySelector('.selectors');

                instanceNode.querySelector('.file__name').textContent = item.fileName;
                instanceNode.querySelector('.file__line-number').textContent = item.lineNumber;

                item.selectors.forEach(selector => {
                    var _node = this.selectorTemplate.querySelector('.rule__selector').cloneNode(true);

                    _node.textContent = selector;
                    selectorsWrapper.appendChild(_node);
                });

                instanceNode.querySelector('.property').textContent = item.origProp;
                instanceNode.querySelector('.value').textContent = item.origValue;
                this.infoBlock.appendChild(instanceNode);
            });
        },
        appendInfoBlock: function (data) {
            if (this.infoBlock) {
                throw new Error('infoBlock already present');
            }

            this.infoBlock = this.template.querySelector('.color-info').cloneNode(true);

            this._displayColor(data.color);
            this._displayInstances(data.instances);

            this.infoWrapper.appendChild(this.infoBlock);
        },
        update: function (data) {
            this.removeOldInfoBlock();
            this.appendInfoBlock(data);
        },
        bindClickHandler: function () {
            var colorList = document.querySelector('.color-list');

            colorList.addEventListener('click', e => {
                var currentTarget = e.target,
                    colorData = JSON.parse(currentTarget.getAttribute('data-color'));

                if (currentTarget.className.indexOf('color-list-item') > -1) {
                    this.update(colorData);
                }
            });
        }
    };


export default infoViewer;