var TableDatatablesManaged = function () {

    var initTable1 = function () {
        var table = $('#sample_1');

        // begin first table
        table.dataTable({
            "ajax": {
                "url" : options.api.base_url+ options.api.topics + "/list",
                "type": "POST",
                "error": $.ajaxSetup().error
            },

            "processing": true,
            "serverSide": true,

            "lengthMenu": [
                [10, 25, 50,],
                [10, 25, 50,] // change per page values here
            ],
            // set the initial value
            "pageLength": 5,
            "columns": [
                { "data": "first_name" },
                { "data": "last_name" },
                { "data": "position" },
                { "data": "office" },
                { "data": "start_date" },
                { "data": "salary" }
            ]
        });


        var tableWrapper = jQuery('#sample_1_wrapper');

        table.find('.group-checkable').change(function () {
            var set = jQuery(this).attr("data-set");
            var checked = jQuery(this).is(":checked");
            jQuery(set).each(function () {
                if (checked) {
                    $(this).prop("checked", true);
                    $(this).parents('tr').addClass("active");
                } else {
                    $(this).prop("checked", false);
                    $(this).parents('tr').removeClass("active");
                }
            });
            jQuery.uniform.update(set);
        });

        table.on('change', 'tbody tr .checkboxes', function () {
            $(this).parents('tr').toggleClass("active");
        });
    }

    return {

        //main function to initiate the module
        init: function () {
            if (!jQuery().dataTable) {
                return;
            }

            initTable1();
        }

    };

}();

if (App.isAngularJsApp() === false) { 
    jQuery(document).ready(function() {
        TableDatatablesManaged.init();
    });
}
