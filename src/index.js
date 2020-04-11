import './style.scss'

const fileInputDom = document.getElementById('image-picker')
const imgImageDom = document.getElementById('img-image')
const canvas = document.getElementById('canvas-image')
const divImageDom = document.getElementById('div-image')
const pointDom = document.getElementById('point')

let width = 300
let height = 186

// canvas.width = width
// canvas.height = height

fileInputDom.onchange = function(event) {
    // console.log(event)
    let files = event.target.files || event.dataTransfer.files
    let file = files[0]
    let img = new Image()

    const context = canvas.getContext('2d')

    if (file.type.match('image.*')) {
        context.clearRect(0, 0, canvas.width, canvas.height)

        let reader = new FileReader()
            // Read in the image file as a data URL.
        reader.readAsDataURL(file)
        reader.onload = function(evt) {
            if (evt.target.readyState == FileReader.DONE) {
                img.src = evt.target.result
                imgImageDom.setAttribute('src', evt.target.result)

                img.onload = function() {
                    let width = this.width
                    let height = this.height

                    imgImageDom.style.width = width
                    imgImageDom.style.height = height

                    canvas.width = width
                    canvas.height = height

                    divImageDom.style.width = width + 'px'
                    divImageDom.style.height = height + 'px'

                    // 将获取图片绘制到canvas上
                    context.drawImage(img, 0, 0, width, height)

                    // 获取图片数据
                    const imageData = context.getImageData(0, 0, width, height)

                    // 获取像素点颜色
                    let shadowArray = []
                    for (let i = 0; i < imageData.data.length; i += 4) {
                        let red = imageData.data[i]
                        let green = imageData.data[i + 1]
                        let blue = imageData.data[i + 2]
                        let alpha = +(imageData.data[i + 3] / 255).toFixed(2)

                        const color =
                            'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')'
                        shadowArray.push(color)
                    }

                    shadowArray = shadowArray.map(function(item, index) {
                        return {
                            color: item,
                            x: index % width,
                            y: Math.floor(index / width),
                        }
                    })

                    let shadowStrArr = []
                    shadowArray.forEach(function(item, index) {
                        // if (item.color !== 'rgba(0,0,0,0)') {
                        shadowStrArr.push(item.x + 'px ' + item.y + 'px 0px ' + item.color)
                            // }
                    })
                    pointDom.style.boxShadow = shadowStrArr.join(',')
                }
            }
        }
    } else {
        alert('not an image')
    }
}