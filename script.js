  function generateFile(format) {
      // 1. Coletar todos os valores do formulário
      const values = {
          identifier: '', // Pode ser preenchido ou gerado aleatoriamente se necessário
          parentidentifier: '',
          language: document.getElementById('language').value,
          type: document.getElementById('type').value,
          title: document.getElementById('title').value,
          abstract: document.getElementById('abstract').value,
          keywords_gemet: document.getElementById('keywords_gemet').value.split(';').map(k => k.trim()).filter(k => k),
          keywords_topic: document.getElementById('keywords_topic').value,
          contact_name: document.getElementById('contact_name').value,
          contact_org: document.getElementById('contact_org').value,
          contact_email: document.getElementById('contact_email').value,
          history: document.getElementById('history').value,
          date_created: document.getElementById('date_created').value,
          fees: '',
          constraints: document.getElementById('constraints').value,
          rights: document.getElementById('rights').value
      };

      // Formatar a data para o padrão do QGIS
      const dateCreatedISO = values.date_created ? `${values.date_created}T00:00:00` : '';
      const metadataCreationDate = new Date().toISOString().split('T')[0]; // Data de hoje

      // Montar as seções de palavras-chave
      let gemetKeywordsXML = '';
      if (values.keywords_gemet.length > 0) {
          gemetKeywordsXML = `<keywords vocabulary="GEMET">
              <keyword>${values.keywords_gemet.join('; ')}</keyword>
          </keywords>`;
      }

      // 2. Montar a estrutura XML/QMD usando Template Literals (crases ``)
      const qmdContent = `
  <qgis version="3.34.14-Prizren">
    <identifier>${values.identifier}</identifier>
    <parentidentifier>${values.parentidentifier}</parentidentifier>
    <language>${values.language}</language>
    <type>${values.type}</type>
    <title>${values.title}</title>
    <abstract>${values.abstract}</abstract>
    ${gemetKeywordsXML}
    <keywords vocabulary="gmd:topicCategory">
      <keyword>${values.keywords_topic}</keyword>
    </keywords>
    <contact>
      <name>${values.contact_name}</name>
      <organization>${values.contact_org}</organization>
      <position></position>
      <voice></voice>
      <fax></fax>
      <email>${values.contact_email}</email>
      <role>pointOfContact</role>
    </contact>
    <links>
      <link name="" url="nan" format="" mimeType="" description="" size="" type=""/>
    </links>
    <history>${values.history}</history>
    <history>Data de criação do metadado: ${metadataCreationDate}</history>
    <dates>
      <date value="${dateCreatedISO}" type="Created"/>
    </dates>
    <fees>${values.fees}</fees>
    <constraints type="Não definido 1">${values.constraints}</constraints>
    <rights>${values.rights}</rights>
    <encoding></encoding>
    <extent>
      <spatial minz="0" miny="179769313486231570814527423731704356798070567525844996598917476803157260780028538760589558632766878171540458953514382464234321326889464182768467546703537516986049910576551282076245490090389328944075868508455133942304583236903222948165808559332123348274797826204144723168738177180919299881250404026184124858368" minx="179769313486231570814527423731704356798070567525844996598917476803157260780028538760589558632766878171540458953514382464234321326889464182768467546703537516986049910576551282076245490090389328944075868508455133942304583236903222948165808559332123348274797826204144723168738177180919299881250404026184124858368" maxy="-179769313486231570814527423731704356798070567525844996598917476803157260780028538760589558632766878171540458953514382464234321326889464182768467546703537516986049910576551282076245490090389328944075868508455133942304583236903222948165808559332123348274797826204144723168738177180919299881250404026184124858368" maxz="0" maxx="-179769313486231570814527423731704356798070567525844996598917476803157260780028538760589558632766878171540458953514382464234321326889464182768467546703537516986049910576551282076245490090389328944075868508455133942304583236903222948165808559332123348274797826204144723168738177180919299881250404026184124858368" dimensions="2"/>
      <temporal>
        <period>
          <start></start>
          <end></end>
        </period>
      </temporal>
    </extent>
  </qgis>
      `.trim();

      let fileContent = '';
      let mimeType = '';
      let filename = document.getElementById('filename_input').value.trim();

      // 3. Preparar o cabeçalho e o nome do arquivo dependendo do formato
      if (format === 'qmd') {
          fileContent = `<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>\n${qmdContent}`;
          mimeType = 'application/xml';
          filename += '.qmd';
      } else { // format === 'xml'
          fileContent = `<?xml version="1.0" encoding="UTF-8"?>\n${qmdContent}`;
          mimeType = 'application/xml';
          filename += '.xml';
      }

      // 4. Criar um "Blob" (um objeto de arquivo) e o link para download
      const blob = new Blob([fileContent], { type: mimeType });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      
      // 5. Simular o clique no link para iniciar o download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }