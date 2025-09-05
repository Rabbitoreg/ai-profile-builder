export const downloadRadarChart = async (elementId, filename = 'profile-radar-chart') => {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      console.error('Element not found:', elementId)
      throw new Error('Element not found')
    }

    // Find the SVG element within the container
    const svgElement = element.querySelector('svg')
    if (!svgElement) {
      throw new Error('SVG not found in container')
    }

    // Get SVG dimensions
    const svgRect = svgElement.getBoundingClientRect()
    const svgWidth = svgRect.width || 400
    const svgHeight = svgRect.height || 400

    // Get SVG data and add proper styling
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const svgWithStyles = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">${svgData.replace('<svg', '<g').replace('</svg>', '</g>')}</svg>`
    
    const svgBlob = new Blob([svgWithStyles], { type: 'image/svg+xml;charset=utf-8' })
    const svgUrl = URL.createObjectURL(svgBlob)

    // Create canvas and draw SVG
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = svgWidth * 2  // Higher resolution
        canvas.height = svgHeight * 2
        
        // Fill white background
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Scale and draw SVG
        ctx.scale(2, 2)
        ctx.drawImage(img, 0, 0, svgWidth, svgHeight)
        
        URL.revokeObjectURL(svgUrl)

        // Create download link
        const link = document.createElement('a')
        link.download = `${filename}.png`
        link.href = canvas.toDataURL('image/png')
        
        // Trigger download
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        resolve()
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(svgUrl)
        reject(new Error('Failed to load SVG'))
      }
      
      img.src = svgUrl
    })
  } catch (error) {
    console.error('Download failed:', error)
    throw error
  }
}
