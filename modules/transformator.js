define([
    'uuid'
],
function(
    uuid
) {

    // function uuid() {
    //     return new Date().getTime().toString().split('').map(function(c) { return String.fromCharCode(97+parseInt(c)); }).join('')
    // }

    function val2spnr(value) {
        return {
            spnr   : value,
            user   : state.user.uid,
            uuid   : uuid.v4(),
            synced : false
        }
    }

    function snap2spnr(snap) {
        var s  = snap.val()
        return s
    }

    return {
        snap2spnr : snap2spnr,
        val2spnr  : val2spnr
    }

})
