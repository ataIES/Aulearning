export default function DashboardLatestList({

    items,

    render,

}) {

    return (

        <div className="learning-activity-list">

            {

                items.map(render)

            }

        </div>

    );

}