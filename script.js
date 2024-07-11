let componentCount = 1; 

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // 阻止表单的默认提交行为
        const queryData = [];
        for (let i = 0; i < componentCount; i++) {
            const type = document.getElementById(`type_${i}`).value;
            const description = document.getElementById(`description_${i}`).value;
            queryData.push({ type, description });
        }
        const data = JSON.stringify({ query: queryData, len: componentCount });
        const socket = new WebSocket('ws://iamdanny.online/ws:8192');
        socket.onopen = function() {
            socket.send(data); 
        };
        socket.onmessage = function(event) {
            var converter = new showdown.Converter();
            var html = converter.makeHtml(event.data);
            document.getElementById('result').innerHTML = html;
        };
        socket.onerror = function() {
            document.getElementById('result').innerHTML = 'Bad Request.';
        };
    });

    
    document.getElementById('add_comp').addEventListener('click', function() {
        if (componentCount < 8) {
            componentCount++;
            const newField = document.createElement('div');
            newField.classList.add('form-group');
            newField.id = `label_${componentCount - 1}`;
            newField.innerHTML = `
                <label for="type_${componentCount - 1}">Component Type | 元件类型</label>
                <select id="type_${componentCount - 1}" class="with-icons">
                    <option value="Promoters" data-icon="./icons/promoter.png">Promoter | 启动子</option>
                    <option value="Ribosome_Binding_Site" data-icon="./icons/ribosome.png">Ribosome Binding Site | 核糖体结合位点</option>
                    <option value="Protein_domains" data-icon="./icons/protein.png">Protein Domains | 蛋白质结构域</option>
                    <option value="Protein_coding_sequences" data-icon="./icons/coding.png">Protein Coding Sequences | 蛋白质编码序列</option>
                    <option value="Translational_units" data-icon="./icons/translational.png">Translational Units</option>
                    <option value="Terminators" data-icon="./icons/terminator.png">Terminator | 终止子</option>
                    <option value="DNA" data-icon="./icons/dna.png">DNA</option>
                    <option value="Plasmid_backbones" data-icon="icons/backbone.png">Plasmid Backbones | 质粒基本结构</option>
                    <option value="Plasmids" data-icon="./icons/plasmid.png">Plasmids | 质粒</option>
                    <option value="Primers" data-icon="./icons/primer.png">Primers | 引物</option>
                    <option value="Composite_Parts" data-icon="./icons/composite.png">Composite Parts | 综合</option>
                </select>
                <label for="description_${componentCount - 1}">Component Description</label>
                <input type="text" id="description_${componentCount - 1}" placeholder="Enter a description">
            `;
            document.getElementById('component-fields').appendChild(newField);
            updateSelectIcons();
        }
    });

    document.getElementById('remove_comp').addEventListener('click', function() {
        if (componentCount > 1) {
            componentCount--;
            document.getElementById('component-fields').removeChild(document.getElementById(`label_${componentCount}`));
        }
    });

    // 下拉菜单添加图标用的
    function updateSelectIcons() {
        const selects = document.querySelectorAll('select.with-icons');
        selects.forEach(select => {
            select.addEventListener('change', function() {
                const icon = this.options[this.selectedIndex].dataset.icon;
                this.style.backgroundImage = `url(${icon})`;
            });
            const icon = select.options[select.selectedIndex].dataset.icon;
            select.style.backgroundImage = `url(${icon})`;
        });
    }
    updateSelectIcons();
});
