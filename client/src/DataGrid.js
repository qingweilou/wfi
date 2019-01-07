import React from 'react';
import ReactDataGrid from 'react-data-grid';

const RowHeaderFormatter = ({ value }) => {
    return <strong>{value}</strong>;
};

export default class DataGrid extends React.Component {
    render() {
        const columns = [{ key: 'rowId', name: '', width: 120, resizable: true, formatter: RowHeaderFormatter}];   
        this.props.columns.forEach( x => { columns.push({key: x, name: x})});
        const rows = [];
        this.props.data && this.props.data.forEach((row, rowNum) => {
            const thisRow = {rowId: this.props.rows[rowNum]};
            row.forEach((val, idx) => {
                thisRow[this.props.columns[idx]] = val;      
            })
            rows.push(thisRow);
        });

        return (        
                <ReactDataGrid
                    columns={columns}
                    rowGetter={i => rows[i]}
                    rowsCount= {rows.length}
                    minHeight={250} />
        );
    };
}