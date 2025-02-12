// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /email/captcha */
export async function getCaptcha(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCaptchaParams,
  options?: { [key: string]: any },
) {
  return request<API.RespVoid>('/email/captcha', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
