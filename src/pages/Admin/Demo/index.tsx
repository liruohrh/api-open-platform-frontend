
import { listApi } from '@/services/api-platform/apiController';
import { UserOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import {
  EditableProTable,
  isDropdownValueType,
  ModalForm,
  ProCard,
  ProFormField,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Modal, Space } from 'antd';
import React, { useState } from 'react';

type DataSourceType = {
  id: React.Key;
  title?: string;
  decs?: string;
  state?: string;
  created_at?: number;
  children?: DataSourceType[];
};

const defaultData: DataSourceType[] = new Array(1).fill(1).map((_, index) => {
  return {
    id: (Date.now() + index).toString(),
    title: `活动名称${index}`,
    decs: '这个活动真好玩',
    state: 'open',
    created_at: 1590486176000,
  };
});

export default () => {

  ;


  const [jsonText, setJsonText] = useState<string>(JSON.stringify({ "code": 123 }));
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map((item) => item.id),
  );
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>(
    () => defaultData,
  );

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '活动名称',
      dataIndex: 'title',
      width: '30%',
      formItemProps: {
        rules: [
          {
            required: true,
            whitespace: true,
            message: '此项是必填项',
          },
          {
            message: '必须包含数字',
            pattern: /[0-9]/,
          },
          {
            max: 16,
            whitespace: true,
            message: '最长为 16 位',
          },
          {
            min: 6,
            whitespace: true,
            message: '最小为 6 位',
          },
        ],
      },
    },
    {
      title: '状态',
      key: 'state',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        open: {
          text: '未解决',
          status: 'Error',
        },
        closed: {
          text: '已解决',
          status: 'Success',
        },
      },
    },
    {
      title: '描述',
      dataIndex: 'decs',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 250,
      render: () => {
        return null;
      },
    },
  ];

  const [isOpenModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpenModal(true)}
      >打开Modal</Button>
      <ModalForm open={isOpenModal} onOpenChange={(open) => {
        if (!open) {
          setOpenModal(false);
        }
      }}>
        <Space direction='horizontal'>
          <Button
            onClick={() => setOpenModal(true)}
          >编辑模式</Button>
          <Button
            onClick={() => setOpenModal(true)}
          >查看模式</Button>
        </Space>
        <ProFormText
          initialValue={"傻逼"}
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined />,
          }}
          name="nickname"
          label={'昵称'}
          required={false}

          rules={[
            {
              min: 1,
              message: '昵称不能为空',
            },
          ]}
        />
      </ModalForm>
      <EditableProTable<DataSourceType>
        headerTitle="可编辑表格"
        columns={columns}
        rowKey="id"
        scroll={{
          x: 960,
        }}
        value={dataSource}
        onChange={setDataSource}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          record: () => ({
            id: Date.now(),
          }),
        }}
        toolBarRender={() => {
          return [
            <Button
              type="primary"
              key="save"
              onClick={() => {
                // dataSource 就是当前数据，可以调用 api 将其保存
                console.log(dataSource);
              }}
            >
              保存数据
            </Button>,
          ];
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
          onValuesChange: (record, recordList) => {
            setDataSource(recordList);
          },
          onChange: setEditableRowKeys,
        }}
      />
      <ProFormField
        fieldProps={{
          style: {
            width: '100%',
          },
        }}
        mode="read"
        valueType="jsonCode"
        editable={(value, record, index) => {
          console.log(value, record, index);

          return true;
        }}
        text={'{a":1}'}
      />



      <ProCard title="表格数据" headerBordered collapsible defaultCollapsed>
        <ProFormField
          ignoreFormItem
          fieldProps={{
            style: {
              width: '100%',
            },
          }}
          mode="read"
          valueType="jsonCode"
          text={JSON.stringify(dataSource)}
        />
      </ProCard>
    </>
  );
};
