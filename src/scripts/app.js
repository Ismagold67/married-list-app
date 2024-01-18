import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import { getFirestore, collection ,getDocs, addDoc, serverTimestamp, doc, deleteDoc /*setDoc*/, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js";
import { generatePDF, generatePDFWithList } from "./genInvite.js";
const firebaseConfig = {
  apiKey: "AIzaSyAbDNHc72qZ4mSOZYOP5Yfe56qF8RAzNtU",
  authDomain: "testing-firebase-ed8b9.firebaseapp.com",
  projectId: "testing-firebase-ed8b9",
  storageBucket: "testing-firebase-ed8b9.appspot.com",
  messagingSenderId: "204071893005",
  appId: "1:204071893005:web:ee3ec992f5dc603cb4fd44",
  measurementId: "G-K4B4KCL6HZ"
};
const log = texto => console.log(texto)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const collectionGames = collection(db, 'games')
const collectionGifts = collection(db, 'gifts')
const colletionPasswords = collection(db, 'passwords')
const formAddGift = document.querySelector('[data-js="add-game-form"]')
const giftList = document.querySelector('[data-js="gift-list"]')
const showListPresents = document.querySelector('.showListPresents')
const navBottom = document.querySelector('[data-js="showList"]')
const container = document.querySelector('.container')
const listGuests = document.querySelector('.listGuests')
const plusGuest = document.querySelector('[data-js="plus-guest"]')
const tablePeople = document.querySelector('[data-table="table-people"]')
const guestList = document.querySelector('[data-js="guest-list"]')
const modal = document.querySelector('[data-question="question"]')
const inputsGuest = document.querySelector('.inputs-guest')
const popup = document.querySelector('.popup')
const formAuthentication = document.querySelector('[data-js="aut"]')
const sanitize = string => DOMPurify.sanitize(string)
const giftWillSend = []
let guestsInvited = []
let passToIndex = ''

const realeseAccess = e => {
    e.preventDefault()
    const passToAccess = e.target.password.value.replace(/\s/g, '')
    passToIndex = passToAccess
    var listPassword = []
    getDocs(colletionPasswords)
        .then(querySnapshot => {
            querySnapshot.docs.forEach(doc => {
                listPassword = doc.data().password
            })
            if(listPassword.includes(passToAccess)){
                alert('Acesso Liberado')
                listGuests.style.display = 'flex'
                popup.style.display = 'none'
                var passUsed = listPassword.indexOf(passToAccess)
                listPassword.splice(passUsed, 1)
                const passRef = doc(db, 'passwords', 'kfcQsEptXlmIOHOgwFRq')
                updateDoc(passRef, { password: listPassword })
                    .then(() => log('Document atualizado'))
                    .catch(log)
            } else {
                alert('Senha Incorreta, tente novamente!!')
            }
        })
        .catch(log)
}

const addGuestInDataBase = e => {
    e.preventDefault()
    console.log(passToIndex)
    let listFromInput = []
    const guests = document.getElementsByName('guest')
    const table = document.querySelector('.table')
    const thead = document.createElement('thead')
    const tr = document.createElement('tr')
    const tbody = document.createElement('tbody')
    const button = document.createElement('button')
    const button2 = document.createElement('button')
    button.setAttribute('data-button','buttonSendListGuests')
    button.setAttribute('class', 'btn btn-primary')
    button.textContent = 'Finalizar'
    button2.setAttribute('data-button2', 'backToTable')
    button2.setAttribute('class', 'btn btn-secondary')
    button2.style.marginTop = '60px'
    button2.textContent = 'Voltar'
    const firstLine = ['#', 'Nome do/da convidado(a)', 'Presença']
    for(let i = 0; i < firstLine.length; i++){
        const th = document.createElement('th')
        th.setAttribute('scope','col')
        th.textContent = `${firstLine[i]}`
        tr.appendChild(th)
    }
    thead.append(tr)
    table.append(thead)

    const processGuests = async () => {
        const existGuest = [];
        try {
            const querySnapshot = await getDocs(collection(db, 'games'));
            querySnapshot.docs.forEach(doc => {
                existGuest.push(doc.data().name);
            });
    
            guests.forEach(item => {
                const randomNumber =  Math.floor(Math.random() * (40 - 10 + 1)) + 10;;
    
                if (existGuest.includes(item.value)) {
                    listFromInput.push(`${item.value} - ${randomNumber}`);
                } else {
                    listFromInput.push(item.value);
                }
            });
            let cont = 0
            listFromInput.forEach(guest => {
                cont++
                const tr2 = document.createElement('tr')
                const th2 = document.createElement('th')
        
                th2.setAttribute('scope', 'row')
                th2.textContent = cont
                tr2.appendChild(th2)
        
                const line = [guest, 'Confirmada']
                for(let i = 0; i < line.length; i++){
                    const td = document.createElement('td')
                    td.textContent = line[i].replace(line[i][0], line[i][0].toUpperCase())
                    tr2.append(td)
                }
                tbody.append(tr2)
            })
            table.append(tbody)
            table.append(button)
            table.append(button2)
            guestList.style.display = 'none'
            for(let i = 0; i < listFromInput.length; i++){
                guestsInvited.push(listFromInput[i])
            }
        } catch (error) {
            console.error(error);
        }
    };
    processGuests();
}


let inp = 0
function addInputGuest(){
    inp++
    const div = document.createElement('div')
    const i = document.createElement('i')
    i.setAttribute('class', 'bx bx-x-circle')
    i.setAttribute('data-i', `inp${inp}`)
    div.setAttribute('class', 'input-group mb-3')
    div.setAttribute('data-div', `inp${inp}`)

    const input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.setAttribute('name', 'guest')
    input.setAttribute('class', 'form-control')
    input.setAttribute('placeholder', 'Digite o nome')
    input.setAttribute('aria-label', `Recipient's username`)
    input.setAttribute('aria-describedby', 'button-addon2')
    input.required = true

    div.appendChild(input)
    div.append(i)
    inputsGuest.append(div)
}

const backToTable = e =>{
    const dataSetButton = e.target.dataset.button2
    if(dataSetButton){
        tablePeople.innerHTML = ''
        guestList.style.display = 'block'
        guestsInvited = []
    }
}

const deleteInputGuest = e =>{
    const datasetRemove = e.target.dataset.i

    if(datasetRemove){
        const inputTarget = document.querySelector(`[data-div="${datasetRemove}"]`)
        inputTarget.remove()
    }
    console.log(datasetRemove)
}

const showContainer = e => {
    const dataButton = e.target.dataset.button
    if(dataButton){
        modal.style.display = 'block'
        tablePeople.style.display = 'none'
        const modalContent = document.createElement('div')
        const modalDialog = document.createElement('div')
        const modalHeader = document.createElement('div')
        const modalBody = document.createElement('div')
        const modalFooter = document.createElement('div')
        const h5 = document.createElement('h5')
        const button = document.createElement('button')
        const p = document.createElement('p')
        const buttonFooter = document.createElement('button')
        const buttonFooter2 = document.createElement('button')

        modal.setAttribute('tabindex', '-1')
        modalDialog.setAttribute('class', 'modal-dialog')
        modalContent.setAttribute('class', 'modal-content')

        modalHeader.setAttribute('class', 'modal-header')
        modalBody.setAttribute('class', 'modal-body')
        modalFooter.setAttribute('class', 'modal-footer')
        h5.setAttribute('class', 'modal-title')
        h5.textContent = 'Convite Finalizado'
        button.type = 'button'
        button.className = 'btn-close'
        button.setAttribute('data-bs-dismiss', 'modal')
        button.ariaLabel = 'Close'
        modalHeader.append(h5, button)

        p.textContent = 'Deseja enviar algum presente ao casal?'
        modalBody.append(p)

        buttonFooter.type = 'button'
        buttonFooter.className = 'btn btn-secondary'
        buttonFooter.setAttribute('data-bs-dismiss', 'modal')
        buttonFooter.textContent = 'Sim'
        buttonFooter.setAttribute('data-y','yes')
        buttonFooter2.type = 'button'
        buttonFooter2.className = 'btn btn-primary'
        buttonFooter2.textContent = 'Não'
        buttonFooter2.setAttribute('data-y', 'no')
        modalFooter.append(buttonFooter, buttonFooter2)
        
        modalContent.append(modalHeader, modalBody, modalFooter)
        modalDialog.append(modalContent)
        modal.append(modalDialog)

        listGuests.append(modal)
    }
}

const presentQuestion = async e => {
    const dataQ = e.target.dataset.y
    console.log(guestsInvited.slice(1))
    if(dataQ == 'yes'){
        container.style.display = 'flex'
        listGuests.style.display = 'none'
    } else {
        const [error, doc] = await to(addDoc(collectionGames, {
            id: passToIndex.replace(/\s/g, ''),
            name: sanitize(guestsInvited[0].replace(/\s/g, '')),
            otherNames: guestsInvited.slice(1).map(name => sanitize(name)),
            createdAt: serverTimestamp(),
            arrayPresents: []
        }))
        if(error) {
            return log(error)
        }
        log('Document criado com o ID ', doc.id)
        alert('Gerando Seu Convite...')
        generatePDF(passToIndex.replace(/\s/g, ''), guestsInvited[0].replace(/\s/g, ''))
        setTimeout(function reload(){
            location.reload()
        }, 5000);
    }
}

getDocs(collectionGifts)
    .then(querySnapshot => {
        querySnapshot.docs.forEach(docu => {
            let presentList = docu.data().gift
            const sizeListGift = presentList.length
            presentList.sort()
            for(let i = 0; i < sizeListGift; i++){
                const col = document.createElement('div')
                col.setAttribute('class', 'col')

                const card = document.createElement('div')
                card.setAttribute('class', 'card')

                const img = document.createElement('img')
                img.setAttribute('class', 'card-img-top')

                const cardBody = document.createElement('div')
                cardBody.setAttribute('class', 'card-body')

                const cardTitle = document.createElement('h5')
                cardTitle.setAttribute('class', 'card-title')
                cardTitle.textContent = presentList[i].toUpperCase()

                let icone = document.createElement('i')
                icone.setAttribute('class', 'bx bx-checkbox')

                cardBody.append(cardTitle, icone)
                card.append(img, cardBody)
                col.append(card)
                giftList.append(col)


                const changeStyleOfSelectedItems = () => {
                        card.style.backgroundColor = '#3a3f44'
                        icone.classList.toggle('bxs-check-square')
                        const nameAtributte = 'bx bx-checkbox bxs-check-square'
                        const selectedPresent = cardTitle.innerText.toLowerCase()
                        if(icone.getAttribute('class') == nameAtributte){
                            giftWillSend.push(selectedPresent)
                        } else{
                            card.style.backgroundColor = ''
                            const removeThis = giftWillSend.indexOf(selectedPresent)
                            giftWillSend.splice(removeThis, 1)
                        }
                        log(giftWillSend)
                    
                }
                card.addEventListener('click', changeStyleOfSelectedItems)

                
                function removeSelectedItems(){
                    const giftsRef = doc(db, 'gifts', 'WIsNeSZUp19oLVb5waOP')
                    let listGiftsModify = presentList
                    for(let j = 0; j < listGiftsModify.length; j++){   
                        if(listGiftsModify.includes(giftWillSend[j])){
                            let indices = listGiftsModify.indexOf(giftWillSend[j])
                            listGiftsModify.splice(indices, 1)
                        }
                    }
                
                    updateDoc(giftsRef, { gift: listGiftsModify })
                        .then(() => log('Document atualizado'))
                        .catch(log)
                }
                
                formAddGift.addEventListener('submit', removeSelectedItems)
                //
            }
        })
    })
    .catch(log)

function showList(){
    const showList = document.querySelector('[data-js="showList"]')
    const cards = document.querySelectorAll('.card')
    if(giftWillSend.length > 0){
        showList.classList.toggle('itsTrue')
    }
    let getNameClass = showList.getAttribute('class')
    let a = showList.querySelector('.nav-link')
    console.log(getNameClass)
    if(getNameClass.includes('nav-item itsTrue')){
        giftWillSend.forEach(item => {
            const li = document.createElement('li')
            li.setAttribute('class', 'list-group-item')
            li.textContent = item
            const i = document.createElement('i')
            i.setAttribute('class', 'bx bx-chevron-down dd')

            showListPresents.append(li)
            a.textContent = 'Voltar'
            a.appendChild(i)
        })

        cards.forEach(card => {
            function showSelectedOnes(){
                const li = document.createElement('li')
                li.setAttribute('class', 'list-group-item')
                let tempLi = card.innerText.toLowerCase()
                li.textContent = tempLi
                showListPresents.appendChild(li)
                console.log(tempLi)
            }
            card.addEventListener('click', showSelectedOnes)
        })
    } else {
        a.textContent = 'Ver Lista'
        const lis = showListPresents.querySelectorAll('li')
        lis.forEach(item => item.style.display = 'none')
    }
}

function showNav(){
    const nav = document.querySelector('.nav')
    const btn = document.querySelector('.btn')
    const cards = document.querySelectorAll('div')
    console.log(cards)
    const showNavBottom = () => {
        nav.style.display = 'flex'
        btn.style.display = 'flex'
        if(giftWillSend <= 0){
            nav.style.display = 'none'
            btn.style.display = 'none'
        }
    }

    cards.forEach(card => {
        card.addEventListener('click', showNavBottom)
    })
}


const to = promise => promise
    .then(result => [null, result])
    .catch(error => [error])


const addGift = async e => {
    e.preventDefault()
    const btnLg = document.querySelector('.btn-lg')
    btnLg.remove()
    const name = e.target.email.value
    if(giftWillSend.length > 0){
        const [error, doc] = await to(addDoc(collectionGames, {
            id: passToIndex.replace(/\s/g, ''),
            name: sanitize(guestsInvited[0].replace(/\s/g, '')),
            description: sanitize(name),
            otherNames: guestsInvited.slice(1).map(name => sanitize(name)),
            createdAt: serverTimestamp(),
            arrayPresents: giftWillSend.map(present => sanitize(present))
        }))
    
        if(error) {
            return log(error)
        }
    
        log('Document criado com o ID ', doc.id)
    
    } else {
        alert('Selecione pelo menos um item para concluir!')
    }
    alert('Aguarde o Download do convite ser concluido!')
    
    generatePDFWithList(passToIndex.replace(/\s/g, ''), guestsInvited[0].replace(/\s/g, ''), giftWillSend)
    setTimeout(function reload(){
        location.reload();
    }, 5000)
}
formAddGift.addEventListener('submit', addGift)
navBottom.addEventListener('click', showList)
formAuthentication.addEventListener('submit', realeseAccess)
plusGuest.addEventListener('click', addInputGuest)
guestList.addEventListener('submit', addGuestInDataBase)
inputsGuest.addEventListener('click', deleteInputGuest)
tablePeople.addEventListener('click', showContainer)
tablePeople.addEventListener('click', backToTable)
modal.addEventListener('click', presentQuestion)
showNav()
