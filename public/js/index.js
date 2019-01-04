/**
 * Created with JetBrains WebStorm.
 * User: Boroda
 * Date: 01.11.13
 * Time: 17:04
 * To change this template use File | Settings | File Templates.
 */
$(function (){
    $(".activity").each(function(){
        if (this.textContent>1000){
            $(this).closest("tr").addClass("danger")
            $(this).text("No")
        } else {
            $(this).closest("tr").addClass("success")
            $(this).text("Yes")
        }
    })
    $(".uptime").each(function(){
        if (this.textContent<6000){
            $(this).text("\<1m");
        } else {
        var minutes=parseFloat(this.textContent)/6000;
        $(this).text(((minutes-minutes%60)/60)+'h '+(minutes%60).toFixed()+'m');
        }
    })
    $('.unknown').each(function(){
        $(this).closest('tr').addClass('warning');

    })

})