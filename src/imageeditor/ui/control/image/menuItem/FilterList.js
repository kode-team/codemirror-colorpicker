import BaseTab from "../../../BaseTab";


export default class FilterList extends BaseTab {

    template () { 
        return `
            <div class="tab inner filter-list-tab">
                <div class="tab-header" ref="$header">
                    <div class="tab-item selected" data-id="filter">Filter</div>
                    <div class="tab-item" data-id="backdropFilter">Backdrop Filter</div>
                </div>
                <div class="tab-body" ref="$body">
                    <div class="tab-content selected" data-id="filter">
                        <div class="filter-list" ref="$filterList">
                            <div class='filter-item data-filter="grayscale">
                                <div class="filter-item-view-container">
                                    <div class="filter-item-blend-view" style='${this.read('/filter/toString', item, 'grayscale')}'></div>
                                    <div class="filter-item-text">Grayscale</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-content" data-id="backdropFilter">
                        <div class="backdrop-filter-list" ref="$backdropFilterList"></div>
                    </div>
                </div>
            </div>        
        `
    }



}