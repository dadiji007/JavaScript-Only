
let playFlag = false
let confirmFlag = false
let clearFlag = false
let lottery_countX = 0

$('.num_btn').on('click', function () {
    if (!confirmFlag) return false
    if (!$('.num_box>div').is(':animated')) {
        if (playFlag == true) {
            return false;  //放置多次点击
        }
        playFlag = true;
        var imgH = 265;

        var number = getRandomNumber() + '';
        $('.num_box>div').css('background-position-y', 0);  //将所有背景图重置为0
        var numArr = number.split('');



        $('.num_box>div').each(function (index) {
            var This = $(this);  //This必须写在外面，不能写在setTimeout里面
            setTimeout(function () {
                This.animate({ 'background-position-y': imgH * 50 - imgH * numArr[index] }, 6000, 'swing');
                if (parseInt(index) == 3) {
                    setTimeout(function () {
                        confirmFlag = false
                        playFlag = false
                        clearFlag = true
                        $('.num_btn').addClass('btn_close')
                        $('.clear').removeClass('lost')
                        $('.confirm').addClass('lost')
                        $('.lottery_response').html('摇奖结果：' + number);

                        let money = parseInt($('.current_money>span').html())
                        //开始匹配
                        $('tr:first-child').siblings().each(function () {

                            let count = 0
                            const lottery_num = $(this).find('td').eq(0).html().split('')

                            for (let i = 0; i < numArr.length; i++) {
                                if (lottery_num[i] == 'x') {
                                    count++
                                } else if (lottery_num[i] != numArr[i]) {
                                    $(this).find('td').eq(2).html('未中奖')
                                    return
                                }
                            }

                            let lottery_money = $(this).find('td').eq(1).html()

                            switch (count) {
                                case 0:
                                    lottery_money = lottery_money * 9500
                                    break
                                case 1:
                                    lottery_money = lottery_money * 950
                                    break
                                case 2:
                                    lottery_money = lottery_money * 95
                                    break
                            }

                            $(this).find('td').eq(2).html('恭喜中奖：' + lottery_money)
                            money += lottery_money

                        })

                        $('.current_money>span').html(money)

                    }, 6000)
                }
            }, 500 * index);
        });
    }
});
function getRandomNumber() {
    var max = 9999;
    var min = 0;
    var numRandom = parseInt(Math.random() * (max - min));
    var str = '';
    if (0 <= numRandom && numRandom < 10) {
        str = '000' + numRandom;
    } else if (10 <= numRandom && numRandom < 100) {
        str = '00' + numRandom;
    } else if (100 <= numRandom && numRandom < 1000) {
        str = '0' + '' + numRandom;
    } else {
        str = '' + numRandom;
    }
    return str;
}

$('.lottery_play_btn .confirm').on('click', function () {

    if (playFlag) return false
    if (clearFlag) return false

    let countX = 0  //计算x的数量，选择赔率
    let lottery_play_num = ''    //选择的号码
    let reg = /^[0-9]*$/    //仅能输入数字

    //判断是否能够下注
    if (!reg.test($('.lottery_play_pay').val())) {
        alert('确认格式是否正确，仅能输入0-9的数字')
        return
    } else if ($('.lottery_play_pay').val() <= 0) {
        alert('再确认一下金额呗')
        return
    } else if ($('.lottery_play_pay').val() - $('.current_money>span').html() > 0) {
        alert('没这么多本钱呀')
        return
    } else {
        $('select').each(function () {
            if ($(this).val() == 'x') countX++

            //确定号码并添加
            lottery_play_num += $(this).val()
        })
        if (countX > 2) {
            alert('选码太少了，请至少选择两码')
            return
        }
    }

    //判断是否选对号码，确认情况下会添加到html中
    if (confirm('确认一下你的号码：' + lottery_play_num)) {

        //更改标志
        confirmFlag = true
        $('.btn_close').removeClass('btn_close')

        //添加标签
        $('.lottery_list>table').append('<tr align="center"><td>' + lottery_play_num + '</td><td>' + $('.lottery_play_pay').val() + '</td><td>未开奖</td></tr>')

        //结算余额
        $('.current_money>span').html(
            $('.current_money>span').html() - $('.lottery_play_pay').val()
        )

        //清零投注金额
        $('.lottery_play_pay').val('')

    }

})

$('.lottery_play_btn .clear').on('click', function () {



    if (playFlag) {
        return false
    } else if (confirmFlag) {
        alert('请等待抽奖后再清除')
    } else if (clearFlag) {
        $('tr:first-child').siblings().remove()
        clearFlag = false
        $('.confirm').removeClass('lost')
        $('.clear').addClass('lost')
    }

})
