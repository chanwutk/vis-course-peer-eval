import csv from 'csvtojson';

const fileInput = document.getElementById('file-input');
const fileDisplayArea = document.getElementById('main');

fileInput.addEventListener('change', function (e) {
  const file = fileInput.files[0];
  const textType = /text.csv/;

  if (file.type.match(textType)) {
    const reader = new FileReader();

    reader.onload = () =>
      csv()
        .fromString(reader.result)
        .then(json => {
          const evals = {};
          json.map(d => {
            if (!evals[d.Email]) {
              evals[d.Email] = [];
            }
            d.Name = d.Name.toLowerCase().split(' ').join(' ');
            evals[d.Email].push(d);
          })

          const entries = Object.entries(evals);
          entries.sort((a, b) => a[0] < b[0] ? -1 : 1)

          entries.forEach(([email, _evals]) => {
            const student = document.createElement('div');
            fileDisplayArea.appendChild(student)

            const header = document.createElement('h2');
            header.innerHTML = email;
            student.appendChild(header);

            const names = document.createElement('h3');
            names.innerHTML = _evals.map(d => d.Name).join(' | ')
            student.appendChild(names);

            _evals.forEach(_eval => {
              const evalDiv = document.createElement('div');
              student.appendChild(evalDiv);

              const group = document.createElement('h4');
              group.innerHTML = _eval.URL;
              evalDiv.appendChild(group);

              ['Like', 'WhatIf', 'Wish'].forEach(cat => {
                const div = document.createElement('div');
                evalDiv.appendChild(div);

                const head = document.createElement('h5');
                head.innerHTML = cat;
                div.appendChild(head);

                const ul = document.createElement('ul');
                div.appendChild(ul);
                [1, 2, 3].forEach(num => {
                  const content = document.createElement('li');
                  content.innerHTML = _eval[cat + num];

                  ul.appendChild(content);
                })

              })
            })

          });
        });

    reader.readAsText(file);
  } else {
    fileDisplayArea.innerText = "Please upload a csv file."
  }
});
