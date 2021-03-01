const paginate = document.querySelector('.paginate')

function addItem(inputDiv, input) {
    const item = document.querySelector(inputDiv)
    const fieldContainer = document.querySelectorAll(input)

    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

    if(newField.value == ""){
        return false
    }

    newField.value = ""
    item.appendChild(newField)
}

if (paginate) {
const page = +paginate.dataset.page
const total = +paginate.dataset.total

let pages = [],
    oldPage 

for (let currentPage = 1; currentPage <= total; currentPage++){
    const pageBeforeCurrentPage = currentPage >= page - 2
    const pageAfterCurrentPage = currentPage <= page + 2
    const firstLastPage = currentPage == 1 || currentPage == total

    if(firstLastPage || pageBeforeCurrentPage && pageAfterCurrentPage){
        if(oldPage && currentPage - oldPage > 2){
            pages.push("...")
        } 
        if(oldPage && currentPage - oldPage == 2){
            pages.push(currentPage - 1)
        }
        pages.push(currentPage)
        oldPage = currentPage
    }
}

elements = ""

for(let page of pages){
    if (String(page).includes('...')){
        elements += `<span>${page}</span>`
    } else {
        elements += `<a href="?page=${page}">${page}</a>`
    }
}

paginate.innerHTML = elements
}

const deleteConfirmation = (event) => {
        const confirmation = confirm(event)
        if(!confirmation){
            event.preventDefault()
            }
}

const Validate = {
    fieldsInput : document.querySelectorAll('.input input'),
    password: document.querySelector('.password input'),
    addREmoveStyle(input, fields){
        const errorDiv = input.parentNode.querySelector('.error')

        if(errorDiv){
            
            return fields.forEach(field=> {
                field.style.border = '1px solid red'
            })
        }else {
            return fields.forEach(field=> {
                field.style.border = '1px solid #DDDDDD'
            })
        }
    },
   apply(input, func){

        Validate.removeError(input)

        let results = Validate[func](input.value)
        input.value = results.value

        if(results.error) Validate.displayError(input, results.error)
        
   },
   displayError(input, error){

        const divError = document.createElement('div')
        const errorTag = document.createElement('p')
        divError.classList.add('error')
        divError.appendChild(errorTag)
        errorTag.innerHTML = error

        input.parentNode.appendChild(divError)

        Validate.addREmoveStyle(input, this.fieldsInput)

        input.focus()
   },
   removeError(input){
        
        const errorDiv = input.parentNode.querySelector('.error')

        if(errorDiv) errorDiv.remove()
        
        Validate.addREmoveStyle(input, this.fieldsInput)
   },
   passwordMatch(value){
        let error = null

        if(this.password.value != value){
            error = "Mismatch password"
        }
        
        return {
            value,
            error
        }

   },
   isEmail(value){
       let error = null

        const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if(!value.match(emailFormat)){
            error = "Invalid Email"
        }

        return {
            error,
            value
        }
   }

}

const ImageGallery = {
    highlight: document.querySelector('.recipe__head__img .highlight'),
    preview: document.querySelectorAll('.recipe__head__img__gallery img'),
    setImage(event){
        const { target } = event

        this.preview.forEach( item => item.classList.remove('active'))

        target.classList.add('active')

        this.highlight.src = target.src
    }
}

const changeAvatar = {
    inputFile: document.querySelector('#inputFile'),
    setAvatarName: (event) => {
        const newValue = event.target.value.replace(/^.*[\\\/]/, '')
        changeAvatar.inputFile.value = newValue
    }
}

const PhotosUpload = {
    preview: document.querySelector('#photos-preview'),
    files: [],
    limit: 5,
    input: "",
    handleFileInput(event){
        const { files: filesList } = event.target
        PhotosUpload.input = event.target

        if(PhotosUpload.hasLimit(event)) return

        Array.from(filesList).forEach(file => {
            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const img = new Image()
                img.src = String(reader.result)

                const div = PhotosUpload.getContainer(img)

                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    getAllFiles(){
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    hasLimit(event){
        const { files: filesList } = PhotosUpload.input

        if(filesList.length > PhotosUpload.limit){
            alert('max photos reached')
            event.preventDefault()

            return true
        }
        
        if(filesList.length + PhotosUpload.files.length > PhotosUpload.limit){
            alert('max photos reached')
            event.preventDefault()

            return true
        }

        return false
    },
    getContainer(img){
        const div = document.createElement('div')
        div.onclick = PhotosUpload.removePhoto
        
        div.classList.add('photo')
        div.appendChild(img)

        div.appendChild(PhotosUpload.removeButton())

        return div
    },
    removeButton(){
        const span = document.createElement('span')
        span.classList.add('material-icons')
        span.innerHTML = "close"

        return span
    },
    removePhoto(event){
     const photoDiv = event.target.parentNode
     const photos = Array.from(PhotosUpload.preview)
     const index = photos.indexOf(photoDiv)

     PhotosUpload.files.splice(index, 1)

     PhotosUpload.input.files = PhotosUpload.getAllFiles()
     
     photoDiv.remove()

    },
    removeOldPhoto(event) {
        const divId = event.target.parentNode
        const removedFile = document.querySelector('input[name="removed_files"]')

        if (divId) removedFile.value += `${divId.id},`

        divId.remove()
    }
}







