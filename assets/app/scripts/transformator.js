define([
    'uuid',
    ],
function(
    uuid
) {

    function val2spnr(value) {
        return {
            spnr   : value,
            user   : state.user.id,
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
