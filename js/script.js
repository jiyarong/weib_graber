const grab_targets_selector = 'h4 > a'
console.log(chrome.storage)

$(grab_targets_selector).attr("target", "_blank").addClass("grab_ready")
//抓列表
const grab_start = () => {
    current_target = $(".grab_ready").first()
    if (current_target.length > 0) {
        window.open(current_target.attr("href"))
        current_target.removeClass("grab_ready")
    } else {
        current_page = parseInt($('.pageLink > strong').first().text())
        $("input[name=page]").val(current_page + 1)
        $("form[name=pagenavi]").submit()
    }
}

// t.string :raw_name #原始卡名
// t.string :name #卡名
// t.string :card_code #卡号
// t.integer :rarity #稀有度
// t.integer :card_type #卡片种类
// t.integer :product_id #产品类别
// t.integer :new_product_id #新产品类别
// t.integer :wing_type #黑翼白翼
// t.string :work_code #工作号码
// t.integer :color #颜色
// t.integer :level #等级
// t.integer :cost #花费
// t.float :attack_value #攻击力
// t.integer :soul #灵魂值
// t.string :raw_url #原始链接
// t.text :raw_content
// t.text :content
// t.text :raw_description
// t.text :description
// t.string :feature #特征

//抓详情
const grab_info = () => {
    const $x = ((STR_XPATH) => {
        var xnodes, xres, xresult;
        xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
        xnodes = [];
        xres = void 0;
        while (xres = xresult.iterateNext()) {
            xnodes.push(xres);
        }
        return xnodes;
    });
    obj = {}
    obj.raw_name = $('.cell_1').next().text()
    obj.card_code = $(".cell_2").text()
    obj.rarity = $(".cell_4").text()
    obj.product_name = $($x('//*[@id="cardDetail"]/table/tbody/tr[3]/td[1]')).text()
    obj.wing_type = $($x('//*[@id="cardDetail"]/table/tbody/tr[3]/td[2]/img')).attr('src') == "/cardlist/partimages/w.gif" ? 0 : 1
    obj.new_product_name = $($x('//*[@id="cardDetail"]/table/tbody/tr[4]/td[1]')).text()
    obj.work_code = $($x('//*[@id="cardDetail"]/table/tbody/tr[4]/td[2]')).text()
    type_obj = {"キャラ" : 1, "イベント" : 2, "クライマックス" : 3}
    obj.type_id = type_obj[$($x('//*[@id="cardDetail"]/table/tbody/tr[5]/td[1]')).text()]
    color_obj = {"red" : 1, "yellow": 2, "blue" : 3, "green" : 4}
    obj.color_id = color_obj[$($x('//*[@id="cardDetail"]/table/tbody/tr[5]/td[2]/img')).attr("src").match(/red|yellow|blue|green/g)[0]]
    obj.level = $($x('//*[@id="cardDetail"]/table/tbody/tr[6]/td[1]')).text()
    obj.cost = $($x('//*[@id="cardDetail"]/table/tbody/tr[6]/td[2]')).text()
    obj.attack_value = $($x('//*[@id="cardDetail"]/table/tbody/tr[7]/td[1]')).text()
    obj.soul = $($x('//*[@id="cardDetail"]/table/tbody/tr[7]/td[2]')).children().length
    obj.trigger = $($x('//*[@id="cardDetail"]/table/tbody/tr[8]/td[1]')).children().map((i,e) => {return $(e).attr("src")}).get().join().match(/soul|bounce|soul2|stock|salvage|bounce|draw|treasure|shot|gate|standby/g)    
    obj.feature = $($x('//*[@id="cardDetail"]/table/tbody/tr[8]/td[2]')).text()
    obj.raw_content = $($x('//*[@id="cardDetail"]/table/tbody/tr[9]/td')).html()
    obj.raw_description = $($x('//*[@id="cardDetail"]/table/tbody/tr[10]/td')).text()    
    obj.remote_picture = "http://ws-tcg.com/" + $($x('//*[@id="cardDetail"]/table/tbody/tr[1]/td[1]/img')).attr('src')
    obj.raw_url = window.location.href


    url = "http://xiayuanyin.cn:4002/api/v1/cards"
    fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }, 
        method: "POST",
        body: JSON.stringify(obj)
    }).then((responseData) => {
        if (responseData.status == 200) {
            return responseData.json()
        }
    }).then((data) => {
        console.log(data)
        chrome.extension.sendMessage({action: "start_grab"});
        window.close()
    }).catch((err) => {
        chrome.storage.local.get("error_data", (d) => {
            d["error_data"].push(obj)
            chrome.storage.local.set({error_data: d["error_data"]})
        })
        chrome.extension.sendMessage({action: "start_grab"});
        window.close()
    })
    
}

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "start_grab") {
        grab_start()
    }
})


chrome.extension.sendMessage({action: "start_grab"});



