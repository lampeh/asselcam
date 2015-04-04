jQuery(function($) {
	if($("#socialshareprivacy").length > 0){
		$("#socialshareprivacy").socialSharePrivacy({
			"css_path": "/socialshareprivacy/socialshareprivacy.min.css",
			"lang_path": "/socialshareprivacy/lang/",
			"services": {
				"facebook": {
					"perma_option": "off",
					"dummy_img": "/socialshareprivacy/images/dummy_facebook.png",
					"sharer": {
						"status": "on",
						"dummy_img": "/socialshareprivacy/images/dummy_facebook_share_de.png",
						"img": "/socialshareprivacy/images/facebook_share_de.png"
					}
				},
				"twitter": {
					"perma_option": "off",
					"dummy_img": "/socialshareprivacy/images/dummy_twitter.png"
				},
				"gplus": {
					"perma_option": "off",
					"dummy_img": "/socialshareprivacy/images/dummy_gplus.png"
				}
			}
		});
	}
});
