module.exports = {
    date(timestamp) {
        const date = new Date(timestamp)
    
        const day = `0${date.getDate()}`.slice(-2)
        const month = `0${date.getMonth() + 1}`.slice(-2)
        const year = date.getFullYear()

        const minutes = `0${date.getMinutes()}`.slice(-2)
        let hour = `0${date.getHours()}`.slice(-2)
        let sec = `0${date.getSeconds()}`.slice(-2)
        
        return {
            day,
            minutes,
            hour,
            month,
            iso: `${year}-${month}-${day} ${hour}:${minutes}:${sec}`,
            birthDay: `${day}/${year}`,
            format: `${day}-${month}-${year}`
        }
    },
    messageCreated(data){
        let success = false

        let now = new Date()
        now = {
            hour: now.getHours(),
            minute: now.getMinutes(),
            seconds: now.getSeconds()
        }

        let messageConfimationAct = new Date(data.created_at)
        messageConfimationAct = {
            hour: messageConfimationAct.getHours(),
            minute: messageConfimationAct.getMinutes(),
            seconds: messageConfimationAct.getSeconds()
        }

        if(now.hour == messageConfimationAct.hour && now.minute == messageConfimationAct.minute && now.seconds == messageConfimationAct.seconds){
            return success = "created successfully"
        }

        return success
    },
    messageUpdated(data){
        let success = false

        messageConfimationAct = new Date(data.updated_at)
        messageConfimationAct = {
            hour: messageConfimationAct.getHours(),
            minute: messageConfimationAct.getMinutes(),
            seconds: messageConfimationAct.getSeconds()
        }

        if(now.hour == messageConfimationAct.hour && now.minute == messageConfimationAct.minute && now.seconds == messageConfimationAct.seconds){
            return success = "updated successfully"
        }

        return success
    }
}
