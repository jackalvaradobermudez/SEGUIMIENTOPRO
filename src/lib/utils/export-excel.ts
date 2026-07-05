'use client'

export interface ExcelCell {
  type: 'String' | 'Number'
  value: string | number | boolean | null | undefined
  style?: 'Header' | 'Currency' | 'Date' | 'Bold' | 'Default'
}

export interface ExcelExportConfig<T> {
  data: T[]
  filename: string
  sheetName?: string
  headers: string[]
  mapping: (row: T) => ExcelCell[]
}

export function exportToExcel<T>(config: ExcelExportConfig<T>) {
  const { data, filename, sheetName = 'Reporte', headers, mapping } = config

  let rowsXml = ''

  // 1. Fila de Cabecera
  rowsXml += '   <Row ss:Height="24">\n'
  for (const header of headers) {
    rowsXml += `    <Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(header)}</Data></Cell>\n`
  }
  rowsXml += '   </Row>\n'

  // 2. Filas de Datos
  for (const item of data) {
    const cells = mapping(item)
    rowsXml += '   <Row ss:Height="20">\n'
    for (const cell of cells) {
      const styleAttr = cell.style ? ` ss:StyleID="${cell.style}"` : ''
      const escapedValue = cell.type === 'String' ? escapeXml(String(cell.value ?? '')) : cell.value
      rowsXml += `    <Cell${styleAttr}><Data ss:Type="${cell.type}">${escapedValue}</Data></Cell>\n`
    }
    rowsXml += '   </Row>\n'
  }

  // 3. Estructura completa XML Spreadsheet 2003
  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:excel"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Author>SeguimientoPro</Author>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#0F172A"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#5B35F5" ss:Pattern="Solid"/>
   <Alignment ss:Vertical="Center" ss:Horizontal="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#4318FF"/>
   </Borders>
  </Style>
  <Style ss:ID="Currency">
   <Alignment ss:Horizontal="Right"/>
   <NumberFormat ss:Format="$#,##0;($#,##0);&quot;-&quot;"/>
  </Style>
  <Style ss:ID="Date">
   <Alignment ss:Horizontal="Center"/>
   <NumberFormat ss:Format="yyyy-mm-dd"/>
  </Style>
  <Style ss:ID="Bold">
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Bold="1" ss:Color="#0F172A"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${escapeXml(sheetName)}">
  <Table>
${rowsXml}
  </Table>
  <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
   <PageSetup>
    <Header x:Margin="0.3"/>
    <Footer x:Margin="0.3"/>
   </PageSetup>
   <Selected/>
   <ProtectObjects>False</ProtectObjects>
   <ProtectScenarios>False</ProtectScenarios>
  </WorksheetOptions>
 </Worksheet>
</Workbook>`

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}-${new Date().toISOString().split('T')[0]}.xls`
  a.click()
  URL.revokeObjectURL(url)
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}
