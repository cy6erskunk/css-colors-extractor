const infoViewer = {
	template: document.querySelector("#template"),
	instanceTemplate: document.querySelector("#instance-template"),
	selectorTemplate: document.querySelector("#selector-template"),
	infoWrapper: document.querySelector(".color-info-wrapper"),
	removeOldInfoBlock: function () {
		this.infoBlock && this.infoWrapper.removeChild(this.infoBlock);
		this.infoBlock = null;
	},
	_displayColor: function (color) {
		this.infoBlock.querySelector(".color").textContent = color.toUpperCase();
	},
	_displayInstances: function (instances) {
		const instancesWrapper = this.infoBlock.querySelector(".instances");

		instances.forEach((item) => {
			const instanceNode = this.instanceTemplate
					.querySelector(".instance")
					.cloneNode(true);
			const selectorsWrapper = instanceNode.querySelector(".selectors");

			instanceNode.querySelector(".file__name").textContent = item.filename;
			instanceNode.querySelector(".file__line-number").textContent =
				item.lineNumber;

			item.selectors.forEach((selector) => {
				const _node = this.selectorTemplate
					.querySelector(".rule__selector")
					.cloneNode(true);

				_node.textContent = selector;
				selectorsWrapper.appendChild(_node);
			});

			instanceNode.querySelector(".property").textContent = item.origProp;
			instanceNode.querySelector(".value").textContent = item.origValue;
			this.infoBlock.appendChild(instanceNode);
		});
	},
	appendInfoBlock: function (data) {
		if (this.infoBlock) {
			throw new Error("infoBlock already present");
		}

		this.infoBlock = this.template.querySelector(".color-info").cloneNode(true);

		this._displayColor(data.color);
		this._displayInstances(data.instances);

		this.infoWrapper.appendChild(this.infoBlock);
	},
	update: function (data) {
		this.removeOldInfoBlock();
		this.appendInfoBlock(data);
	},
	bindClickHandlers: function () {
		const colorList = document.querySelector(".color-list");

		colorList.addEventListener("click", (e) => {
			const currentTarget = e.target;
			const colorData = JSON.parse(currentTarget.getAttribute("data-color"));

			if (currentTarget.className.indexOf("color-list-item") > -1) {
				this.update(colorData);
			}
		});

		document
			.querySelector("#show-all-colors")
			.addEventListener("change", (e) => {
				this.fiftyShadesOfGray(e.currentTarget.checked);
				localStorage.setItem("color", e.currentTarget.checked);
			});

		const _c = localStorage.getItem("color") === "true";
		this.fiftyShadesOfGray(!!_c);
		document.querySelector("#show-all-colors").checked = !!_c;
	},
	fiftyShadesOfGray: function (showAll) {
		const nodeList = document.querySelectorAll(".color-list-item");

		[].forEach.call(nodeList, (i) => {
			if (showAll) {
				i.className = i.className.replace(/ hidden/, "");
				i.style.order = 0;
			} else {
				const _a = JSON.parse(i.getAttribute("data-color-array"));

				if (Math.abs(_a[0] - _a[1]) < 15 && Math.abs(_a[0] - _a[2]) < 15) {
					i.style.order = _a[0];
				} else {
					i.className = `${i.className} hidden`;
				}
			}
		});
	},
};

export default infoViewer;
