import { useEffect, useState } from 'react';
import Divider from '../components/common/Divider';
import Title from '../components/common/Title';
import { StoreLayout } from '../components/layout/layout';
import { tableNames, tables } from '../data/tables';
import { supabase } from '../utils/supabase-client';
import { toast } from 'react-toastify';
import LoadingIndicator from '../components/common/LoadingIndicator';
import { ClipboardCopyIcon } from '@heroicons/react/outline';
import { useUser } from '../hooks/useUser';
import { Prism } from '@mantine/prism';

QueryPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

const demoCode = `import { Button } from '@mantine/core';

function Demo() {
  return <Button>Hello</Button>
}`;

export default function QueryPage() {
    const { userData } = useUser();

    const [tablesData, setTablesData] = useState([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        try {
            if (!userData) return;
            if (!userData.isAdmin) {
                toast.error('You are not authorized to access this page.');
                return;
            }

            // for each table name, fetch the data
            const tablePromises = tableNames.map(async (tableName) => {
                const { data, error } = await supabase
                    .from(tableName)
                    .select('*');

                if (error) throw error;

                return {
                    name: tableName,
                    data,
                };
            });

            Promise.all(tablePromises).then((results) => {
                setTablesData(results);
            });
        } catch (err) {
            toast.error(err);
        }
    }, [userData]);

    useEffect(() => {
        if (!tablesData || !tablesData.length) return;

        let response =
            '-- By default, Supabase uses the `public` database.\n\n';

        for (let i = 0; i < tablesData.length; i++) {
            const table = tablesData[i];
            const tableColumns = tables.find(
                (t) => t.name === table.name
            ).columns;

            const tableName = table.name;
            const tableData = table.data;

            response += `-- Populate data for the ${tableName} table.\n`;
            response += `INSERT INTO\n\tpublic.${tableName}(${tableColumns.join(
                ', '
            )}) VALUES\n`;

            for (let j = 0; j < tableData.length; j++) {
                const row = tableData[j];

                response += `\t\t(${tableColumns
                    .map((c) =>
                        row[c] === 'null' || row[c] === null || row[c] === ''
                            ? 'NULL'
                            : typeof row[c] === 'string'
                            ? `'${row[c].replace(/'/g, "''")}'`
                            : row[c]
                    )
                    .join(', ')})`;

                if (j < tableData.length - 1) response += ',\n';
            }

            response += ';';
            if (i < tablesData.length - 1) response += '\n\n';
        }

        console.log(response);
        setQuery(response);
    }, [tablesData]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    return (
        <div className="p-4 md:p-8 lg:p-16 space-y-8">
            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                <Title label="Database Insert Queries" />
                <Divider />

                {query ? (
                    <Prism language="sql">{query}</Prism>
                ) : (
                    <div className="w-full text-center">
                        <LoadingIndicator svgClassName="w-8 h-8" />
                    </div>
                )}
            </div>
        </div>
    );
}
