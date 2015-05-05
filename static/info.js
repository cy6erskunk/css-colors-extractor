var infoViewer = {
        template: document.querySelector('#template'),
        update: function (data) {
            var oldInfoBlock = document.querySelector('body > .color-info'),
                color = data.color,
                colorData = data.instances,
                infoBlock = this.template.querySelector('.color-info').cloneNode(true),
                instanceTemplate = this.template.querySelector('.instance').cloneNode(true);

            // remove old info block
            oldInfoBlock && document.body.removeChild(oldInfoBlock);
            infoBlock.removeChild(infoBlock.querySelector('.instance'));

            // render color value
            infoBlock.querySelector('.color').textContent = color.toUpperCase();

            // render instances
            colorData.forEach(function (item) {
                var instanceNode = instanceTemplate.cloneNode(true),
                    ruleNode = instanceNode.querySelector('.rule'),
                    selectorNode = instanceNode.querySelector('.rule__selector');

                // display first selector
                selectorNode.textContent = item.selectors[0];
                // display more selectors, if present
                item.selectors.slice(1).forEach(function (selector, i) {
                    var _node = selectorNode.cloneNode();

                    _node.textContent = selector + i;
                    instanceNode.insertBefore(_node, ruleNode.nextSibling);
                });

                instanceNode.querySelector('.file__name').textContent = item.fileName;
                instanceNode.querySelector('.file__line-number').textContent = item.lineNumber;
                instanceNode.querySelector('.property').textContent = item.origProp;
                instanceNode.querySelector('.value').textContent = item.origValue;
                infoBlock.appendChild(instanceNode);
            });
            document.body.insertBefore(infoBlock, colorList);
        }
    },
    colorList = document.querySelector('.color-list');

colorList.addEventListener('click', function (e) {
    var currentTarget = e.target,
        colorData = JSON.parse(currentTarget.getAttribute('data-color'));

    infoViewer.update(colorData);
});
