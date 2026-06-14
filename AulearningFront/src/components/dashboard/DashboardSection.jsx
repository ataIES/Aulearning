export default function DashboardSection({

    title,

    children,

    action,

}) {

    return (

        <div className="learning-panel">

            <div className="learning-panel-header">

                <h5>{title}</h5>

                {action}

            </div>

            {children}

        </div>

    );

}