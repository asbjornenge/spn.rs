define([], function() {

    function Spnr(ref) {
        this.data = ref.val()
        this.uuid = ref.name()
    }

    return {
        Spnr : Spnr
    }

})
