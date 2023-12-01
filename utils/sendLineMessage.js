async function sendLineMessage(url, replyMessage, userText) {
    const result = await checkMessages(userText)
    replyMessage.messages = [ { type: 'text', text: result } ]
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(replyMessage)
    })
    return response.json();
}

async function checkMessages(messages) {
    const messagesArray = messages.split(' ')

    const payload = {
        text: messagesArray[0],
        price: +(messagesArray[1]),
        createdAt: new Date()
    }
    if (messages.includes('ฉุกเฉิน')) {
        return `https://fluffy-gingersnap-4caa99.netlify.app/emergency-calls`
    }


    if (messages.includes('ค่าใช้จ่ายทั้งหมด') || messages.includes('ค่าใช้จ่าย') ) {
        const res = await fetch(process.env.DATABASE)
        const data = await res.json()
    
        let total = 0
        for (const key in data) {
            let price = data[key].price
            console.log(price)
            if (!data[key].price) {
                price = 0
            } 

            total += price
        }

        return `ค่าใช้จ่ายทั้งหมด ${total} บาท`
    }
    if (messages.includes('-ค่า') || messages.slice(0,3) === 'ค่า') {
        try {
            const res = await fetch(process.env.DATABASE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
            await res.json()
            return `[ ${(payload.createdAt).toLocaleString()} ] บันทึกรายการ ${messages} เรียบร้อย`
        } catch(err) {
            console.log(err)
        }

    } 
    
    return 'กรุณากรอกใหม่อีกครั้ง'
    
}
module.exports = {checkMessages}
module.exports = {sendLineMessage};