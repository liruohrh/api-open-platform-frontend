import { MailOutlined, UserOutlined } from '@ant-design/icons';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import '@umijs/max';
import { notification, Space, Typography } from 'antd';
import React, { useState } from 'react';
import { UserAvatarUpload } from '@/components';
import { updateUser } from '@/services/api-platform/userController';
import { getSamePropButValueNotEquals } from '@/utils';


export type UpdateFormProps = {
  onFormFinish: (submitSuccess: boolean) => Promise<void>;
  handlerCloseModal: () => void;
  isOpenUpdateModal: boolean;
  values: Partial<API.UserVo>;
};
const UpdateForm: React.FC<UpdateFormProps> = ({ onFormFinish, handlerCloseModal, isOpenUpdateModal, values }) => {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(true);
  let avatarUrl = values.avatarUrl;
  const setAvatarUrl = (url: string) => {
    avatarUrl = url;
  };
  return (
    //Modal可以在任意地方使用，重新渲染本组件才会删除Modal，否则Modal仅仅是关闭而已，可以用Modal.useModal手动管理，但是就只是
    <ModalForm
      title={'编辑用户信息'}
      open={isOpenUpdateModal}
      onFinish={async (value) => {
        //点击关闭按钮才会finish
        setConfirmLoading(false);
        try {
          value.avatarUrl = avatarUrl;
          const toUpdateData = getSamePropButValueNotEquals(value, values);
          if (Object.keys(toUpdateData).length === 0) {
            notification.warning({ message: "更新失败！没有需要被修改的值" });
            console.warn("toUpdateData=", toUpdateData, "value=", value, "old=", values);
            return;
          }
          const updateData = {
            ...getSamePropButValueNotEquals(value, values),
            id: value.id
          }
          if (Object.keys(updateData).length === 1) {
            await onFormFinish(false);
            return;
          }
          const data = await updateUser({
            ...updateData
          });
          if (data.data) {
            notification.success({ message: "更新成功！" });
          }
          await onFormFinish(data.data ? true : false);
        } finally {
          setConfirmLoading(true);
        }
      }}
      onOpenChange={(open) => {
        //点击取消、确认、关闭按钮都会设置open=false，但是onFinish时open不会变
        if (!open) {
          handlerCloseModal();
        }
      }}
      modalProps={{
        // 这样才会销毁Modal，也可以调用Modal.destroyAll()
        destroyOnClose: true,
        confirmLoading: confirmLoading
      }}
    >
      <ProFormText name="id" hidden initialValue={values.id} />
      <Space direction={'horizontal'}
        size={20}
      >
        <Space direction={'horizontal'}>
          <Typography.Text>头像：</Typography.Text>
          <UserAvatarUpload
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
          />
        </Space>
        <Space direction={"vertical"}>
          <Space direction={"horizontal"}>
            <ProFormText
              initialValue={values.nickname}
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
            <ProFormText
              initialValue={values.username}
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
              name="username"
              label={'用户名'}
              rules={[
                {
                  pattern: /^\w+$/,
                  message: '用户名只能是字母数字下划线',
                },
              ]}
              required={false}
            />
          </Space>
          <Space direction={"horizontal"} style={{ width: "100%" }} styles={{ item: { flex: 1 } }}>
            <ProFormSelect
              initialValue={values.role}
              name="role"
              label={'角色'}
              valueEnum={{
                USER: '普通用户',
                ADMIN: '管理员',
              }}
              required={false}
            />
            <ProFormSelect
              initialValue={values.status}
              name="status"
              label={'状态'}
              valueEnum={{
                0: {
                  text: '正常',
                  status: 'Success',
                },
                1: {
                  text: '冻结',
                  status: 'Warning',
                },
              }}
              required={false}
            />
          </Space>
        </Space>
      </Space>


      <ProFormText
        initialValue={values.email}
        fieldProps={{
          size: 'large',
          prefix: <MailOutlined />,
        }}
        name="email"
        label={'邮箱'}
        rules={[
          {
            pattern:
              /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(?:\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
            message: '不合法的邮箱！',
          },
        ]}
        required={false}
      />

      <ProFormTextArea
        initialValue={values.personalDescription}
        name="personalDescription"
        label={'个人描述'}
        rules={[
          {
            max: 256,
            message: '个人描述长度最多256',
          },
        ]}
        required={false}
      />
    </ModalForm>
  );
};
export default UpdateForm;
