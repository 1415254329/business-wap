<template>
  <Row :gutter="16">
    <Col span="6">
      <Card>
        <div>职位列表</div>
        <div class="list">
          <Scroll>
            <RadioGroup
              v-model="department"
              type="button"
              vertical
              class="button"
              @on-change="change_positions"
            >
              <Radio
                :label="item.id"
                :value="item.alias"
                v-for="(item, index) in positions"
                :key="index"
                >{{ item.alias }}</Radio
              >
            </RadioGroup>
          </Scroll>
          <Scroll>
            <RadioGroup
              v-model="position_id"
              type="button"
              vertical
              class="button"
              @on-change="change_position_id"
            >
              <Radio
                :label="item.id"
                v-for="(item, index) in list"
                :key="index"
                >{{ item.alias }}</Radio
              >
            </RadioGroup>
          </Scroll>
        </div>
      </Card>
    </Col>
    <Col span="4">
      <Card>
        <div>会员等级</div>
        <RadioGroup v-model="grade" type="button" vertical class="button">
          <Radio label="0">全部不区分</Radio>
          <Radio label="1">散客</Radio>
          <Radio label="2">不区分会员等级</Radio>
          <Radio
            :label="item.id"
            v-for="(item, index) in member_rule"
            :key="index"
            >{{ item.name }}</Radio>
        </RadioGroup>
      </Card>
    </Col>
    <Modal :scrollable="true" v-model="modal1" title="修改/删除提成规则">
      <Scroll>
        <Form :model="formItem2" :label-width="80" ref="formItem2">
          <FormItem label="性别">
            <RadioGroup v-model="formItem2.sex">
              <Radio label="buqufen">不区分</Radio>
              <Radio label="man">男</Radio>
              <Radio label="woman">女</Radio>
            </RadioGroup>
          </FormItem>
          <template v-if="$route.params.name == 'tenant_project'">
            <FormItem label="提成基数">
              <RadioGroup v-model="formItem2.jishu">
                <Radio label="female">实收业绩</Radio>
                <Radio label="male">实付业绩</Radio>
              </RadioGroup>
            </FormItem>
          </template>
          <template v-elseif="$route.params.name == 'tenant_speedy'">
            <FormItem label="计算类型">
              <RadioGroup v-model="formItem1.jishu">
                <Radio label="female">实付业绩</Radio>
                <Radio label="daozhang">到账业绩</Radio>
              </RadioGroup>
            </FormItem>
          </template>
          <Card class="mt">
            <p slot="title">游客-(提成)</p>
            <p class="mt">指定</p>
            <Input v-model="formItem2.tourist_text" type="number">
              <RadioGroup
                v-model="formItem2.tourist"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.tourist == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
            <p class="mt">非指定</p>
            <Input v-model="formItem2.tourist_no_appoint" type="number">
              <RadioGroup
                v-model="formItem2.tourist_no"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.tourist_no == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
          </Card>
          <Card class="mt">
            <p slot="title">业绩</p>
            <p class="mt">指定</p>
            <Input v-model="formItem2.achievement_text" type="number">
              <RadioGroup
                v-model="formItem2.achievement"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.achievement == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
            <p class="mt">非指定</p>
            <Input v-model="formItem2.achievement_no_text" type="number">
              <RadioGroup
                v-model="formItem2.achievement_no"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.achievement_no == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
          </Card>
          <Card class="mt">
            <p slot="title">扣成本</p>
            <p class="mt">指定</p>
            <Input v-model="formItem2.cost_input" type="number">
              <RadioGroup
                v-model="formItem2.cost_select"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.cost_select == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
            <p class="mt">非指定</p>
            <Input v-model="formItem2.no_cost" type="number">
              <RadioGroup
                v-model="formItem2.no_cost_select"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.no_cost_select == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
          </Card>
          <Card class="mt">
            <p slot="title">二次扣成本</p>
            <p class="mt">指定</p>
            <Input v-model="formItem2.radio" type="number">
              <RadioGroup
                v-model="formItem2.select"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.select == 'bili'">%</Button>
              <Button slot="append" v-else>元</Button>
            </Input>
            <p class="mt">非指定</p>
            <Input v-model="formItem2.no_radio" type="number">
              <RadioGroup
                v-model="formItem2.no_select"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.no_select == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
          </Card>
        </Form>
      </Scroll>
      <div slot="footer">
        <Button type="error" size="large" @click="del">删除</Button>
        <Button type="primary" size="large" @click="edit">修改</Button>
      </div>
    </Modal>
    <Modal :scrollale="true" v-model="modal3" title="修改/删除提成规则">
      <Scroll>
        <Form :model="formItem2" :label-width="80" ref="formItem1">
          <FormItem label="性别">
            <RadioGroup v-model="formItem2.sex">
              <Radio label="buqufen">不区分</Radio>
              <Radio label="man">男</Radio>
              <Radio label="woman">女</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="提成基数">
            <RadioGroup v-model="formItem2.jishu">
              <Radio label="female">实收业绩</Radio>

              <Radio label="male">实付业绩</Radio>
            </RadioGroup>
          </FormItem>
          <Card class="mt">
            <p slot="title">会员-(销售提成)</p>
            <p class="mt">指定</p>
            <Input v-model="formItem2.tourist_text" type="number">
              <RadioGroup
                v-model="formItem2.tourist"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.tourist == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
            <p class="mt">非指定</p>
            <Input v-model="formItem2.tourist_no_appoint" type="number">
              <RadioGroup
                v-model="formItem2.tourist_no"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.tourist_no == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
          </Card>
          <Card class="mt">
            <p slot="title">业绩-(销售业绩)</p>
            <p class="mt">指定</p>
            <Input v-model="formItem2.achievement_text" type="number">
              <RadioGroup
                v-model="formItem2.achievement"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.achievement == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
            <p class="mt">非指定</p>
            <Input v-model="formItem2.achievement_no_text" type="number">
              <RadioGroup
                v-model="formItem2.achievement_no"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.achievement_no == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
          </Card>
          <Card class="mt">
            <p slot="title">售卖扣成本</p>
            <p class="mt">指定</p>
            <Input v-model="formItem2.cost_input" type="number">
              <RadioGroup
                v-model="formItem2.cost_select"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.cost_select == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
            <p class="mt">非指定</p>
            <Input v-model="formItem2.no_cost" type="number">
              <RadioGroup
                v-model="formItem2.no_cost_select"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.no_cost_select == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
          </Card>
          <Card class="mt">
            <p slot="title">售卖二次扣成本</p>
            <p class="mt">指定</p>
            <Input v-model="formItem2.radio" type="number">
              <RadioGroup
                v-model="formItem2.select"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.select == 'bili'">%</Button>
              <Button slot="append" v-else>元</Button>
            </Input>
            <p class="mt">非指定</p>
            <Input v-model="formItem2.no_radio" type="number">
              <RadioGroup
                v-model="formItem2.no_select"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.no_select == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
          </Card>
          <Card class="mt">
            <p slot="title">计次使用提成</p>
            <p class="mt">指定</p>
            <Input v-model="formItem2.achievement_text_sy" type="number">
              <RadioGroup
                v-model="formItem2.achievement_sy"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.achievement_sy == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
            <p class="mt">非指定</p>
            <Input v-model="formItem2.achievement_no_text_sy" type="number">
              <RadioGroup
                v-model="formItem2.achievement_no_sy"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.achievement_no_sy == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
          </Card>
          <Card class="mt">
            <p slot="title">计次使用业绩</p>
            <p class="mt">指定</p>
            <Input v-model="formItem2.achievement_text_sy2" type="number">
              <RadioGroup
                v-model="formItem2.achievement_sy2"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.achievement_sy2 == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
            <p class="mt">非指定</p>
            <Input v-model="formItem2.achievement_no_text_sy2" type="number">
              <RadioGroup
                v-model="formItem2.achievement_no_sy2"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button
                slot="append"
                v-if="formItem2.achievement_no_sy2 == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
          </Card>
          <Card class="mt">
            <p slot="title">使用扣成本</p>
            <p class="mt">指定</p>
            <Input v-model="formItem1.cost_input_sy" type="number">
              <RadioGroup
                v-model="formItem1.cost_select_sy"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem1.cost_select_sy == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
            <p class="mt">非指定</p>
            <Input v-model="formItem1.no_cost_sy" type="number">
              <RadioGroup
                v-model="formItem1.no_cost_select_sy"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem1.no_cost_select_sy == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
          </Card>
          <Card class="mt">
            <p slot="title">使用二次扣成本</p>
            <p class="mt">指定</p>
            <Input v-model="formItem1.radio_sy" type="number">
              <RadioGroup
                v-model="formItem1.select_sy"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem1.select_sy == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
            <p class="mt">非指定</p>
            <Input v-model="formItem1.no_radio_sy" type="number">
              <RadioGroup
                v-model="formItem1.no_select_sy"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem1.no_select_sy == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
          </Card>
        </Form>
      </Scroll>
      <div slot="footer">
        <Button type="error" size="large" @click="del">删除</Button>
        <Button type="primary" size="large" @click="edit">修改</Button>
      </div>
    </Modal>
    <!-- 开卡提成设置 -->
    <Modal :scrollale="true" v-model="modal2" title="修改/删除提成规则">
      <Scroll>
        <Form :model="formItem2" :label-width="80" ref="formItem1">
          <FormItem label="性别">
            <RadioGroup v-model="formItem2.sex">
              <Radio label="buqufen">不区分</Radio>
              <Radio label="man">男</Radio>
              <Radio label="woman">女</Radio>
            </RadioGroup>
          </FormItem>
           <template v-if="$route.params.name == 'tenant_member'">
            <FormItem label="计算类型">
              <RadioGroup v-model="formItem1.jishu">
                <Radio label="female">实付业绩</Radio>
              </RadioGroup>
            </FormItem>
          </template>
          <template v-else>
          <FormItem label="计算类型">
            <RadioGroup v-model="formItem2.jishu">
              <Radio label="female">实付业绩</Radio>
              <Radio label="daozhang">到账业绩</Radio>
            </RadioGroup>
          </FormItem>
          </template>

          <Card class="mt" v-show="formItem2.kaika == 1">
            <p slot="title">会员-(1人提成)</p>
            <p class="mt">指定</p>
            <Input v-model="formItem2.tourist_text" type="number">
              <RadioGroup
                v-model="formItem2.tourist"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.tourist == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
            <p class="mt">非指定</p>
            <Input v-model="formItem2.tourist_no_appoint" type="number">
              <RadioGroup
                v-model="formItem2.tourist_no"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.tourist_no == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
          </Card>
          <Card class="mt" v-show="formItem2.kaika == 1">
            <p slot="title">业绩-(1人业绩)</p>
            <p class="mt">指定</p>
            <Input v-model="formItem2.achievement_text" type="number">
              <RadioGroup
                v-model="formItem2.achievement"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.achievement == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
            <p class="mt">非指定</p>
            <Input v-model="formItem2.achievement_no_text" type="number">
              <RadioGroup
                v-model="formItem2.achievement_no"
                slot="prepend"
                style="width: 100px"
              >
                <Radio label="bili">比例</Radio>
                <Radio label="duing">固定</Radio>
              </RadioGroup>
              <Button slot="append" v-if="formItem2.achievement_no == 'bili'"
                >%</Button
              >
              <Button slot="append" v-else>元</Button>
            </Input>
          </Card>
          <div v-show="formItem2.kaika == 2">
            <Card class="mt">
              <p slot="title">会员-(1人提成)</p>
              <p class="mt">指定</p>
              <Input v-model="formItem2.tourist_text_one" type="number">
                <RadioGroup
                  v-model="formItem2.tourist_two_one"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem2.tourist_one == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem2.tourist_no_appoint_one" type="number">
                <RadioGroup
                  v-model="formItem2.tourist_no_one"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem2.tourist_no_one == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">业绩-(1人业绩)</p>
              <p class="mt">指定</p>
              <Input v-model="formItem2.achievement_text_one" type="number">
                <RadioGroup
                  v-model="formItem2.achievement_one"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem2.achievement_one == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem2.achievement_no_text_one" type="number">
                <RadioGroup
                  v-model="formItem2.achievement_no_one"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button
                  slot="append"
                  v-if="formItem2.achievement_no_one == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">会员-(2人提成)</p>
              <p class="mt">指定</p>
              <Input v-model="formItem2.tourist_text_two" type="number">
                <RadioGroup
                  v-model="formItem2.tourist_two_two"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem2.tourist_two == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem2.tourist_no_appoint_two" type="number">
                <RadioGroup
                  v-model="formItem2.tourist_no_two"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem2.tourist_no_two == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">业绩-(2人业绩)</p>
              <p class="mt">指定</p>
              <Input v-model="formItem2.achievement_text_two" type="number">
                <RadioGroup
                  v-model="formItem2.achievement_two"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem2.achievement_two == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem2.achievement_no_text_two" type="number">
                <RadioGroup
                  v-model="formItem2.achievement_no_two"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button
                  slot="append"
                  v-if="formItem2.achievement_no_two == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
          </div>
          <div v-show="formItem1.kaika == 3">
            <Card class="mt">
              <p slot="title">会员-(1人提成)</p>
              <p class="mt">指定</p>
              <Input v-model="formItem2.tourist_text_three_one" type="number">
                <RadioGroup
                  v-model="formItem2.tourist_three_one"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button
                  slot="append"
                  v-if="formItem2.tourist_three_one == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input
                v-model="formItem2.tourist_no_appoint_three_one"
                type="number"
              >
                <RadioGroup
                  v-model="formItem2.tourist_no_three_one"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button
                  slot="append"
                  v-if="formItem2.tourist_no_three_one == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">业绩-(1人业绩)</p>
              <p class="mt">指定</p>
              <Input
                v-model="formItem2.achievement_text_three_one"
                type="number"
              >
                <RadioGroup
                  v-model="formItem2.achievement_three_one"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button
                  slot="append"
                  v-if="formItem2.achievement_three_one == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input
                v-model="formItem2.achievement_no_text_three_one"
                type="number"
              >
                <RadioGroup
                  v-model="formItem2.achievement_no_three_one"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button
                  slot="append"
                  v-if="formItem2.achievement_no_three_one == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">会员-(2人提成)</p>
              <p class="mt">指定</p>
              <Input v-model="formItem2.tourist_text_three_two" type="number">
                <RadioGroup
                  v-model="formItem2.tourist_three_two"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button
                  slot="append"
                  v-if="formItem2.tourist_three_two == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input
                v-model="formItem2.tourist_no_appoint_three_two"
                type="number"
              >
                <RadioGroup
                  v-model="formItem2.tourist_no_three_two"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button
                  slot="append"
                  v-if="formItem2.tourist_no_three_two == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">业绩-(2人业绩)</p>
              <p class="mt">指定</p>
              <Input
                v-model="formItem2.achievement_text_three_two"
                type="number"
              >
                <RadioGroup
                  v-model="formItem2.achievement_three_two"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button
                  slot="append"
                  v-if="formItem2.achievement_three_two == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input
                v-model="formItem2.achievement_no_text_three_two"
                type="number"
              >
                <RadioGroup
                  v-model="formItem2.achievement_no_three_two"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button
                  slot="append"
                  v-if="formItem2.achievement_no_three_two == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">会员-(3人提成)</p>
              <p class="mt">指定</p>
              <Input v-model="formItem2.tourist_text_three_" type="number">
                <RadioGroup
                  v-model="formItem2.tourist_three_"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem2.tourist_three_ == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input
                v-model="formItem2.tourist_no_appoint_three_"
                type="number"
              >
                <RadioGroup
                  v-model="formItem2.tourist_no_three_"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button
                  slot="append"
                  v-if="formItem2.tourist_no_three_ == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">业绩-(3人业绩)</p>
              <p class="mt">指定</p>
              <Input v-model="formItem2.achievement_text_three_" type="number">
                <RadioGroup
                  v-model="formItem2.achievement_three_"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button
                  slot="append"
                  v-if="formItem2.achievement_three_ == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input
                v-model="formItem2.achievement_no_text_three_"
                type="number"
              >
                <RadioGroup
                  v-model="formItem2.achievement_no_three_"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button
                  slot="append"
                  v-if="formItem2.achievement_no_three_ == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
          </div>
        </Form>
      </Scroll>
      <div slot="footer">
        <Button type="error" size="large" @click="del">删除</Button>
        <Button type="primary" size="large" @click="edit">修改</Button>
      </div>
    </Modal>
    <template v-if="this.$route.params.name == 'tenant_project'">
      <Col span="6">
        <Card>
          <div>项目列表</div>
          <div class="list">
            <Scroll>
              <RadioGroup
                v-model="formItem1.projects"
                type="button"
                vertical
                class="button"
                @on-change="change_project"
              >
                <Radio
                  :label="item.id"
                  v-for="(item, index) in project_fenlei"
                  :key="index"
                  >{{ item.alias }}</Radio
                >
              </RadioGroup>
            </Scroll>
            <Scroll>
              <RadioGroup
                v-model="formItem1.projects_list"
                type="button"
                vertical
                class="button"
              >
                <span @click="get_category">
                  <Radio
                    :label="item.id"
                    v-for="(item, index) in project_list"
                    :key="index"
                  >
                    {{ item.alias }}
                  </Radio>
                </span>
              </RadioGroup>
            </Scroll>
          </div>
        </Card>
      </Col>
      <Col span="8">
        <Card>
          <div>提成设置</div>
          <Form :model="formItem1" :label-width="80" ref="formItem1">
            <FormItem label="性别">
              <RadioGroup v-model="formItem1.sex">
                <Radio label="buqufen">不区分</Radio>
                <Radio label="man">男</Radio>
                <Radio label="woman">女</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="提成基数">
              <RadioGroup v-model="formItem1.jishu">
                <Radio label="female">实收业绩</Radio>
                <Radio label="male">实付业绩</Radio>
              </RadioGroup>
            </FormItem>
            <Card class="mt">
              <p slot="title">游客-(提成)</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.tourist_text" type="number">
                <RadioGroup
                  v-model="formItem1.tourist"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.tourist == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.tourist_no_appoint" type="number">
                <RadioGroup
                  v-model="formItem1.tourist_no"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.tourist_no == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">业绩</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.achievement_text" type="number">
                <RadioGroup
                  v-model="formItem1.achievement"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.achievement == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.achievement_no_text" type="number">
                <RadioGroup
                  v-model="formItem1.achievement_no"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.achievement_no == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">扣成本</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.cost_input" type="number">
                <RadioGroup
                  v-model="formItem1.cost_select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.cost_select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.no_cost" type="number">
                <RadioGroup
                  v-model="formItem1.no_cost_select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.no_cost_select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">二次扣成本</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.radio" type="number">
                <RadioGroup
                  v-model="formItem1.select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.no_radio" type="number">
                <RadioGroup
                  v-model="formItem1.no_select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.no_select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <div class="mt">
              <FormItem>
                <Button type="primary" @click="handleSubmit('formItem1')"
                  >保存</Button
                >
              </FormItem>
            </div>
          </Form>
        </Card>
      </Col>
    </template>
    <template v-if="this.$route.params.name == 'tenant_speedy'">
      <Col span="4">
        <Card>
          <div>快速消费</div>
          <div class="list">
            <span @click="get_category">
              <Radio label="0">快速消费提成设置</Radio>
            </span>
          </div>
        </Card>
      </Col>
      <Col span="10">
        <Card>
          <div>提成设置</div>
          <Form :model="formItem1" :label-width="80" ref="formItem1">
            <FormItem label="性别">
              <RadioGroup v-model="formItem1.sex">
                <Radio label="buqufen">不区分</Radio>
                <Radio label="man">男</Radio>
                <Radio label="woman">女</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="计算类型">
              <RadioGroup v-model="formItem1.jishu">
                <Radio label="female">实付业绩</Radio>
                <Radio label="daozhang">到账业绩</Radio>
              </RadioGroup>
            </FormItem>
            <Card class="mt">
              <p slot="title">游客-(提成)</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.tourist_text" type="number">
                <RadioGroup
                  v-model="formItem1.tourist"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.tourist == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.tourist_no_appoint" type="number">
                <RadioGroup
                  v-model="formItem1.tourist_no"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.tourist_no == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">业绩</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.achievement_text" type="number">
                <RadioGroup
                  v-model="formItem1.achievement"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.achievement == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.achievement_no_text" type="number">
                <RadioGroup
                  v-model="formItem1.achievement_no"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.achievement_no == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">扣成本</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.cost_input" type="number">
                <RadioGroup
                  v-model="formItem1.cost_select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.cost_select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.no_cost" type="number">
                <RadioGroup
                  v-model="formItem1.no_cost_select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.no_cost_select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">二次扣成本</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.radio" type="number">
                <RadioGroup
                  v-model="formItem1.select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.no_radio" type="number">
                <RadioGroup
                  v-model="formItem1.no_select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.no_select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <div class="mt">
              <FormItem>
                <Button type="primary" @click="handleSubmit('formItem1')"
                  >保存</Button
                >
              </FormItem>
            </div>
          </Form>
        </Card>
      </Col>
    </template>
    <template v-if="this.$route.params.name == 'tenant_member'">
      <Col span="4">
        <Card>
          <div>开卡提成设置</div>
          <div class="list">
            <RadioGroup v-model="formItem1.kaika" type="button" class="button">
              <span @click="get_category"
                ><Radio label="1">单人开卡提成设置</Radio></span
              >
              <span @click="get_category"
                ><Radio label="2">两人开卡提成设置</Radio></span
              >
              <span @click="get_category"
                ><Radio label="3">三人开卡提成设置</Radio></span
              >
            </RadioGroup>
          </div>
        </Card>
      </Col>
      <Col span="10">
        <Card>
          <div>提成设置</div>
          <Form :model="formItem1" :label-width="80" ref="formItem1">
            <FormItem label="性别">
              <RadioGroup v-model="formItem1.sex">
                <Radio label="buqufen">不区分</Radio>
                <Radio label="man">男</Radio>
                <Radio label="woman">女</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="计算类型">
              <RadioGroup v-model="formItem1.jishu">
                <Radio label="female">实付业绩</Radio>
                <!-- <Radio label="daozhang">到账业绩</Radio> -->
              </RadioGroup>
            </FormItem>
            <Card class="mt" v-show="formItem1.kaika == 1">
              <p slot="title">会员-(1人提成)</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.tourist_text" type="number">
                <RadioGroup
                  v-model="formItem1.tourist"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.tourist == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.tourist_no_appoint" type="number">
                <RadioGroup
                  v-model="formItem1.tourist_no"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.tourist_no == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt" v-show="formItem1.kaika == 1">
              <p slot="title">业绩-(1人业绩)</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.achievement_text" type="number">
                <RadioGroup
                  v-model="formItem1.achievement"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.achievement == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.achievement_no_text" type="number">
                <RadioGroup
                  v-model="formItem1.achievement_no"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.achievement_no == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <div v-show="formItem1.kaika == 2">
              <Card class="mt">
                <p slot="title">会员-(1人提成)</p>
                <p class="mt">指定</p>
                <Input v-model="formItem1.tourist_text_one" type="number">
                  <RadioGroup
                    v-model="formItem1.tourist_two_one"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button slot="append" v-if="formItem1.tourist_one == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input v-model="formItem1.tourist_no_appoint_one" type="number">
                  <RadioGroup
                    v-model="formItem1.tourist_no_one"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.tourist_no_one == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
              <Card class="mt">
                <p slot="title">业绩-(1人业绩)</p>
                <p class="mt">指定</p>
                <Input v-model="formItem1.achievement_text_one" type="number">
                  <RadioGroup
                    v-model="formItem1.achievement_one"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_one == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input
                  v-model="formItem1.achievement_no_text_one"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.achievement_no_one"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_no_one == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
              <Card class="mt">
                <p slot="title">会员-(2人提成)</p>
                <p class="mt">指定</p>
                <Input v-model="formItem1.tourist_text_two" type="number">
                  <RadioGroup
                    v-model="formItem1.tourist_two_two"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button slot="append" v-if="formItem1.tourist_two == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input v-model="formItem1.tourist_no_appoint_two" type="number">
                  <RadioGroup
                    v-model="formItem1.tourist_no_two"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.tourist_no_two == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
              <Card class="mt">
                <p slot="title">业绩-(2人业绩)</p>
                <p class="mt">指定</p>
                <Input v-model="formItem1.achievement_text_two" type="number">
                  <RadioGroup
                    v-model="formItem1.achievement_two"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_two == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input
                  v-model="formItem1.achievement_no_text_two"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.achievement_no_two"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_no_two == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
            </div>
            <div v-show="formItem1.kaika == 3">
              <Card class="mt">
                <p slot="title">会员-(1人提成)</p>
                <p class="mt">指定</p>
                <Input v-model="formItem1.tourist_text_three_one" type="number">
                  <RadioGroup
                    v-model="formItem1.tourist_three_one"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.tourist_three_one == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input
                  v-model="formItem1.tourist_no_appoint_three_one"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.tourist_no_three_one"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.tourist_no_three_one == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
              <Card class="mt">
                <p slot="title">业绩-(1人业绩)</p>
                <p class="mt">指定</p>
                <Input
                  v-model="formItem1.achievement_text_three_one"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.achievement_three_one"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_three_one == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input
                  v-model="formItem1.achievement_no_text_three_one"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.achievement_no_three_one"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_no_three_one == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
              <Card class="mt">
                <p slot="title">会员-(2人提成)</p>
                <p class="mt">指定</p>
                <Input v-model="formItem1.tourist_text_three_two" type="number">
                  <RadioGroup
                    v-model="formItem1.tourist_three_two"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.tourist_three_two == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input
                  v-model="formItem1.tourist_no_appoint_three_two"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.tourist_no_three_two"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.tourist_no_three_two == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
              <Card class="mt">
                <p slot="title">业绩-(2人业绩)</p>
                <p class="mt">指定</p>
                <Input
                  v-model="formItem1.achievement_text_three_two"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.achievement_three_two"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_three_two == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input
                  v-model="formItem1.achievement_no_text_three_two"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.achievement_no_three_two"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_no_three_two == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
              <Card class="mt">
                <p slot="title">会员-(3人提成)</p>
                <p class="mt">指定</p>
                <Input v-model="formItem1.tourist_text_three_" type="number">
                  <RadioGroup
                    v-model="formItem1.tourist_three_"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.tourist_three_ == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input
                  v-model="formItem1.tourist_no_appoint_three_"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.tourist_no_three_"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.tourist_no_three_ == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
              <Card class="mt">
                <p slot="title">业绩-(3人业绩)</p>
                <p class="mt">指定</p>
                <Input
                  v-model="formItem1.achievement_text_three_"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.achievement_three_"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_three_ == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input
                  v-model="formItem1.achievement_no_text_three_"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.achievement_no_three_"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_no_three_ == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
            </div>
            <div class="mt">
              <FormItem>
                <Button type="primary" @click="handleSubmit('formItem1')"
                  >保存</Button
                >
              </FormItem>
            </div>
          </Form>
        </Card>
      </Col>
    </template>
    <template v-if="this.$route.params.name == 'tenant_deposit'">
      <Col span="4">
        <Card>
          <div>充值</div>
          <div class="list">
            <RadioGroup v-model="formItem1.kaika" type="button" class="button">
              <span @click="get_category"
                ><Radio label="1">单人充值设置</Radio></span
              >
              <span @click="get_category"
                ><Radio label="2">两人充值设置</Radio></span
              >
              <span @click="get_category"
                ><Radio label="3">三人充值设置</Radio></span
              >
            </RadioGroup>
          </div>
        </Card>
      </Col>
      <Col span="10">
        <Card>
          <div>提成设置</div>
          <Form :model="formItem1" :label-width="80" ref="formItem1">
            <FormItem label="性别">
              <RadioGroup v-model="formItem1.sex">
                <Radio label="buqufen">不区分</Radio>
                <Radio label="man">男</Radio>
                <Radio label="woman">女</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="计算类型">
              <RadioGroup v-model="formItem1.jishu">
                <Radio label="female">实付业绩</Radio>
                <Radio label="daozhang">到账业绩</Radio>
              </RadioGroup>
            </FormItem>
            <Card class="mt" v-show="formItem1.kaika == 1">
              <p slot="title">会员-(1人提成)</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.tourist_text" type="number">
                <RadioGroup
                  v-model="formItem1.tourist"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.tourist == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.tourist_no_appoint" type="number">
                <RadioGroup
                  v-model="formItem1.tourist_no"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.tourist_no == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt" v-show="formItem1.kaika == 1">
              <p slot="title">业绩-(1人业绩)</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.achievement_text" type="number">
                <RadioGroup
                  v-model="formItem1.achievement"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.achievement == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.achievement_no_text" type="number">
                <RadioGroup
                  v-model="formItem1.achievement_no"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.achievement_no == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <div v-show="formItem1.kaika == 2">
              <Card class="mt">
                <p slot="title">会员-(1人提成)</p>
                <p class="mt">指定</p>
                <Input v-model="formItem1.tourist_text_one" type="number">
                  <RadioGroup
                    v-model="formItem1.tourist_two_one"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button slot="append" v-if="formItem1.tourist_one == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input v-model="formItem1.tourist_no_appoint_one" type="number">
                  <RadioGroup
                    v-model="formItem1.tourist_no_one"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.tourist_no_one == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
              <Card class="mt">
                <p slot="title">业绩-(1人业绩)</p>
                <p class="mt">指定</p>
                <Input v-model="formItem1.achievement_text_one" type="number">
                  <RadioGroup
                    v-model="formItem1.achievement_one"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_one == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input
                  v-model="formItem1.achievement_no_text_one"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.achievement_no_one"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_no_one == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
              <Card class="mt">
                <p slot="title">会员-(2人提成)</p>
                <p class="mt">指定</p>
                <Input v-model="formItem1.tourist_text_two" type="number">
                  <RadioGroup
                    v-model="formItem1.tourist_two_two"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button slot="append" v-if="formItem1.tourist_two == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input v-model="formItem1.tourist_no_appoint_two" type="number">
                  <RadioGroup
                    v-model="formItem1.tourist_no_two"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.tourist_no_two == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
              <Card class="mt">
                <p slot="title">业绩-(2人业绩)</p>
                <p class="mt">指定</p>
                <Input v-model="formItem1.achievement_text_two" type="number">
                  <RadioGroup
                    v-model="formItem1.achievement_two"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_two == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input
                  v-model="formItem1.achievement_no_text_two"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.achievement_no_two"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_no_two == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
            </div>
            <div v-show="formItem1.kaika == 3">
              <Card class="mt">
                <p slot="title">会员-(1人提成)</p>
                <p class="mt">指定</p>
                <Input v-model="formItem1.tourist_text_three_one" type="number">
                  <RadioGroup
                    v-model="formItem1.tourist_three_one"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.tourist_three_one == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input
                  v-model="formItem1.tourist_no_appoint_three_one"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.tourist_no_three_one"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.tourist_no_three_one == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
              <Card class="mt">
                <p slot="title">业绩-(1人业绩)</p>
                <p class="mt">指定</p>
                <Input
                  v-model="formItem1.achievement_text_three_one"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.achievement_three_one"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_three_one == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input
                  v-model="formItem1.achievement_no_text_three_one"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.achievement_no_three_one"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_no_three_one == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
              <Card class="mt">
                <p slot="title">会员-(2人提成)</p>
                <p class="mt">指定</p>
                <Input v-model="formItem1.tourist_text_three_two" type="number">
                  <RadioGroup
                    v-model="formItem1.tourist_three_two"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.tourist_three_two == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input
                  v-model="formItem1.tourist_no_appoint_three_two"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.tourist_no_three_two"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.tourist_no_three_two == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
              <Card class="mt">
                <p slot="title">业绩-(2人业绩)</p>
                <p class="mt">指定</p>
                <Input
                  v-model="formItem1.achievement_text_three_two"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.achievement_three_two"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_three_two == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input
                  v-model="formItem1.achievement_no_text_three_two"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.achievement_no_three_two"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_no_three_two == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
              <Card class="mt">
                <p slot="title">会员-(3人提成)</p>
                <p class="mt">指定</p>
                <Input v-model="formItem1.tourist_text_three_" type="number">
                  <RadioGroup
                    v-model="formItem1.tourist_three_"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.tourist_three_ == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input
                  v-model="formItem1.tourist_no_appoint_three_"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.tourist_no_three_"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.tourist_no_three_ == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
              <Card class="mt">
                <p slot="title">业绩-(3人业绩)</p>
                <p class="mt">指定</p>
                <Input
                  v-model="formItem1.achievement_text_three_"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.achievement_three_"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_three_ == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
                <p class="mt">非指定</p>
                <Input
                  v-model="formItem1.achievement_no_text_three_"
                  type="number"
                >
                  <RadioGroup
                    v-model="formItem1.achievement_no_three_"
                    slot="prepend"
                    style="width: 100px"
                  >
                    <Radio label="bili">比例</Radio>
                    <Radio label="duing">固定</Radio>
                  </RadioGroup>
                  <Button
                    slot="append"
                    v-if="formItem1.achievement_no_three_ == 'bili'"
                    >%</Button
                  >
                  <Button slot="append" v-else>元</Button>
                </Input>
              </Card>
            </div>
            <div class="mt">
              <FormItem>
                <Button type="primary" @click="handleSubmit('formItem1')"
                  >保存</Button
                >
              </FormItem>
            </div>
          </Form>
        </Card>
      </Col>
    </template>
    <template v-if="this.$route.params.name == 'tenant_commodity'">
      <Col span="6">
        <Card>
          <div>商品列表</div>
          <div class="list">
            <Scroll>
              <RadioGroup
                v-model="formItem1.shops"
                type="button"
                vertical
                class="button"
                @on-change="change_shop"
              >
                <Radio
                  :label="item.id"
                  v-for="(item, index) in shop_fenlei"
                  :key="index"
                  >{{ item.alias }}</Radio
                >
              </RadioGroup>
            </Scroll>
            <Scroll>
              <RadioGroup
                v-model="formItem1.shops_list"
                type="button"
                vertical
                class="button"
              >
                <span
                  @click="get_category"
                  v-for="(item, index) in shop_list"
                  :key="index"
                >
                  <Radio :label="item.id">
                    {{ item.alias }}
                  </Radio>
                </span>
              </RadioGroup>
            </Scroll>
          </div>
        </Card>
      </Col>
      <Col span="8">
        <Card>
          <div>商品提成设置</div>
          <Form :model="formItem1" :label-width="80" ref="formItem1">
            <FormItem label="性别">
              <RadioGroup v-model="formItem1.sex">
                <Radio label="buqufen">不区分</Radio>
                <Radio label="man">男</Radio>
                <Radio label="woman">女</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="提成基数">
              <RadioGroup v-model="formItem1.jishu">
                <Radio label="female">实收业绩</Radio>

                <Radio label="male">实付业绩</Radio>
              </RadioGroup>
            </FormItem>
            <Card class="mt">
              <p slot="title">游客-(提成)</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.tourist_text" type="number">
                <RadioGroup
                  v-model="formItem1.tourist"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.tourist == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.tourist_no_appoint" type="number">
                <RadioGroup
                  v-model="formItem1.tourist_no"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.tourist_no == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">业绩</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.achievement_text" type="number">
                <RadioGroup
                  v-model="formItem1.achievement"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.achievement == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.achievement_no_text" type="number">
                <RadioGroup
                  v-model="formItem1.achievement_no"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.achievement_no == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">扣成本</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.cost_input" type="number">
                <RadioGroup
                  v-model="formItem1.cost_select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.cost_select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.no_cost" type="number">
                <RadioGroup
                  v-model="formItem1.no_cost_select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.no_cost_select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">二次扣成本</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.radio" type="number">
                <RadioGroup
                  v-model="formItem1.select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.no_radio" type="number">
                <RadioGroup
                  v-model="formItem1.no_select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.no_select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <div class="mt">
              <FormItem>
                <Button type="primary" @click="handleSubmit('formItem1')"
                  >保存</Button
                >
              </FormItem>
            </div>
          </Form>
        </Card>
      </Col>
    </template>
    <template v-if="this.$route.params.name == 'tenant_meter'">
      <Col span="6">
        <Card>
          <div>计次</div>
          <div class="list">
            <Scroll>
              <RadioGroup
                v-model="formItem1.jici"
                type="button"
                vertical
                class="button"
                @on-change="change_jc"
              >
                <Radio
                  :label="item.id"
                  v-for="(item, index) in jici_fenlei"
                  :key="index"
                  >{{ item.alias }}</Radio
                >
              </RadioGroup>
            </Scroll>
            <Scroll>
              <RadioGroup
                v-model="formItem1.jicis_list"
                type="button"
                vertical
                class="button"
              >
                <span
                  @click="get_category"
                  v-for="(item, index) in jici_list"
                  :key="index"
                >
                  <Radio :label="item.id">
                    {{ item.alias }}
                  </Radio>
                </span>
              </RadioGroup>
            </Scroll>
          </div>
        </Card>
      </Col>
      <Col span="8">
        <Card>
          <div>计次提成设置</div>
          <Form :model="formItem1" :label-width="80" ref="formItem1">
            <FormItem label="性别">
              <RadioGroup v-model="formItem1.sex">
                <Radio label="buqufen">不区分</Radio>
                <Radio label="man">男</Radio>
                <Radio label="woman">女</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="提成基数">
              <RadioGroup v-model="formItem1.jishu">
                <Radio label="female">实收业绩</Radio>

                <Radio label="male">实付业绩</Radio>
              </RadioGroup>
            </FormItem>
            <Card class="mt">
              <p slot="title">会员-(销售提成)</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.tourist_text" type="number">
                <RadioGroup
                  v-model="formItem1.tourist"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.tourist == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.tourist_no_appoint" type="number">
                <RadioGroup
                  v-model="formItem1.tourist_no"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.tourist_no == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">业绩-(销售业绩)</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.achievement_text" type="number">
                <RadioGroup
                  v-model="formItem1.achievement"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.achievement == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.achievement_no_text" type="number">
                <RadioGroup
                  v-model="formItem1.achievement_no"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.achievement_no == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">售卖扣成本</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.cost_input" type="number">
                <RadioGroup
                  v-model="formItem1.cost_select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.cost_select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.no_cost" type="number">
                <RadioGroup
                  v-model="formItem1.no_cost_select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.no_cost_select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">售卖二次扣成本</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.radio" type="number">
                <RadioGroup
                  v-model="formItem1.select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.no_radio" type="number">
                <RadioGroup
                  v-model="formItem1.no_select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.no_select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">计次使用提成</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.achievement_text_sy" type="number">
                <RadioGroup
                  v-model="formItem1.achievement_sy"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.achievement_sy == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.achievement_no_text_sy" type="number">
                <RadioGroup
                  v-model="formItem1.achievement_no_sy"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button
                  slot="append"
                  v-if="formItem1.achievement_no_sy == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">计次使用业绩</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.achievement_text_sy2" type="number">
                <RadioGroup
                  v-model="formItem1.achievement_sy2"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.achievement_sy2 == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.achievement_no_text_sy2" type="number">
                <RadioGroup
                  v-model="formItem1.achievement_no_sy2"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button
                  slot="append"
                  v-if="formItem1.achievement_no_sy2 == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">使用扣成本</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.cost_input_sy" type="number">
                <RadioGroup
                  v-model="formItem1.cost_select_sy"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.cost_select_sy == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.no_cost_sy" type="number">
                <RadioGroup
                  v-model="formItem1.no_cost_select_sy"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button
                  slot="append"
                  v-if="formItem1.no_cost_select_sy == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">使用二次扣成本</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.radio_sy" type="number">
                <RadioGroup
                  v-model="formItem1.select_sy"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.select_sy == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.no_radio_sy" type="number">
                <RadioGroup
                  v-model="formItem1.no_select_sy"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.no_select_sy == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <div class="mt">
              <FormItem>
                <Button type="primary" @click="handleSubmit('formItem1')"
                  >保存</Button
                >
              </FormItem>
            </div>
          </Form>
        </Card>
      </Col>
    </template>
    <template v-if="this.$route.params.name == 'tenant_wastage'">
      <Col span="6">
        <Card>
          <div>耗品</div>
          <div class="list">
            <Scroll>
              <RadioGroup
                v-model="formItem1.kaika"
                type="button"
                vertical
                class="button"
              >
                <span @click="get_category">
                  <Radio
                    :label="item.id"
                    v-for="(item, index) in wastage_list"
                    :key="index"
                    >{{ item.alias }}</Radio
                  >
                </span>
              </RadioGroup>
            </Scroll>
          </div>
        </Card>
      </Col>
      <Col span="8">
        <Card>
          <div>耗品提成设置</div>
          <Form :model="formItem1" :label-width="80" ref="formItem1">
            <FormItem label="性别">
              <RadioGroup v-model="formItem1.sex">
                <Radio label="buqufen">不区分</Radio>
                <Radio label="man">男</Radio>
                <Radio label="woman">女</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="提成基数">
              <RadioGroup v-model="formItem1.jishu">
                <Radio label="female">实收业绩</Radio>

                <Radio label="male">实付业绩</Radio>
              </RadioGroup>
            </FormItem>
            <Card class="mt">
              <p slot="title">游客-(扣提成)</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.tourist_text" type="number">
                <RadioGroup
                  v-model="formItem1.tourist"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.tourist == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.tourist_no_appoint" type="number">
                <RadioGroup
                  v-model="formItem1.tourist_no"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.tourist_no == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">业绩-（扣业绩）</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.achievement_text" type="number">
                <RadioGroup
                  v-model="formItem1.achievement"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.achievement == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.achievement_no_text" type="number">
                <RadioGroup
                  v-model="formItem1.achievement_no"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.achievement_no == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">扣成本</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.cost_input" type="number">
                <RadioGroup
                  v-model="formItem1.cost_select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.cost_select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.no_cost" type="number">
                <RadioGroup
                  v-model="formItem1.no_cost_select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.no_cost_select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <Card class="mt">
              <p slot="title">二次扣成本</p>
              <p class="mt">指定</p>
              <Input v-model="formItem1.radio" type="number">
                <RadioGroup
                  v-model="formItem1.select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
              <p class="mt">非指定</p>
              <Input v-model="formItem1.no_radio" type="number">
                <RadioGroup
                  v-model="formItem1.no_select"
                  slot="prepend"
                  style="width: 100px"
                >
                  <Radio label="bili">比例</Radio>
                  <Radio label="duing">固定</Radio>
                </RadioGroup>
                <Button slot="append" v-if="formItem1.no_select == 'bili'"
                  >%</Button
                >
                <Button slot="append" v-else>元</Button>
              </Input>
            </Card>
            <div class="mt">
              <FormItem>
                <Button type="primary" @click="handleSubmit('formItem1')"
                  >保存</Button
                >
              </FormItem>
            </div>
          </Form>
        </Card>
      </Col>
    </template>
  </Row>
</template>

<script>
import { getCategory, getProject, getRoyalty } from '../../../api/common'
import {
  getInfo,
  add_royalty,
  edit_royalty,
  del_royalty
} from '../../../api/user'
export default {
  name: 'commission_setting',
  data () {
    return {
      modal1: false,
      modal2: false, // 开卡提成设置弹窗
      modal3: false, // 计次提成设置弹窗
      positions: [], // 部门列表
      list: [], // 职位
      member_rule: [],
      project_fenlei: [],
      project_list: [],
      department: '', // 部门id
      position_id: '', // 职位id
      grade: '0', // 会员等级id,
      jici_list: [],
      jici_fenlei: [],
      wastage_list: [], // 耗品列表
      shop_fenlei: [], // 商品分类列表
      shop_list: [], // 商品列表
      formItem1: {
        sex: 'buqufen',
        jishu: 'female',
        tourist: 'bili',
        tourist_no: 'bili',
        achievement: 'bili',
        achievement_no: 'bili',
        cost_select: 'bili',
        no_cost_select: 'bili',
        select: 'bili',
        no_select: 'bili'
      }, // 项目列表添加
      formItem2: {} // 项目列表修改/删除
    }
  },
  mounted () {
    const position = JSON.parse(localStorage.getItem('position'))
    this.positions = position.filter((val) => val.status != 1)
    this.positions.unshift({ id: 0, alias: '全部不区分' })
    this.department = this.positions[0].id
    this.position_id = this.positions[0].id
    this.get_list(this.department)
    // 获取会员等级
    const member_rule = JSON.parse(localStorage.getItem('userInfo'))
    if (member_rule) {
      this.member_rule = JSON.parse(member_rule.member_rule)
    } else {
      getInfo().then((res) => {
        if (res.code === 0) {
          this.member_rule = JSON.parse(res.data.member_rule)
        }
      })
    }
    if (this.$route.params.name == 'tenant_project') {
      this.get_project('project')
    } else if (this.$route.params.name == 'tenant_meter') {
      this.get_project('jici')
    } else if (this.$route.params.name == 'tenant_wastage') {
      // 获取耗品列表
      const wastage_list = JSON.parse(localStorage.getItem('wastage_list'))
      this.wastage_list = wastage_list
    } else if (this.$route.params.name == 'tenant_commodity') {
      this.get_project('shop')
    }
  },
  methods: {
    // 获取当前部门下的职位列表
    get_list (id) {
      this.positions.forEach((val) => {
        if (val.id == id) {
          if (val.positions) {
            this.list = val.positions.filter((val) => val.status != 1)
            // this.position_id = this.list[0].id;
            // console.log(this.position_id)
          } else {
            this.list = []
          }
        }
      })
    },

    change_positions (e) {
      this.get_list(e)
      this.position_id = e
    },
    // 选择职位
    change_position_id (e) {
      this.position_id = e
    },
    get_project (num, id) {
      // 获取服务项目分类列表
      getCategory().then((res) => {
        if (res.code == 0) {
          if (num == 'project') {
            if (res.data.tenant_project) {
              this.project_fenlei = res.data.tenant_project.filter(
                (val) => val.status !== 1
              )
            }
            // 获取服务项目列表
            const project_list = JSON.parse(
              localStorage.getItem('project_list')
            )
            // 获取项目分类下的列表
            if (project_list) {
              let arr = []
              project_list.forEach((val) => {
                if (val.id == id) {
                  arr.push(val)
                }
              })
              this.project_list = arr
            } else {
              getProject().then((res) => {
                console.log(res)
                if (res.code == 0) {
                  if (JSON.stringify(res.data) != '{}') {
                    res.data.forEach((val) => {
                      if (val.id == id) {
                        arr.push(val)
                      }
                    })
                    this.project_list = arr
                  }
                }
              })
            }
          } else if (num == 'jici') {
            // 获取计次分类列表
            if (res.data.tenant_meter) {
              this.jici_fenlei = res.data.tenant_meter.filter(
                (val) => val.status !== 1
              )
              // 获取计次分类下的列表
              const jici_list = JSON.parse(localStorage.getItem('meter_list'))
              // console.log(jici_list)
              if (jici_list) {
                let arr = []
                jici_list.forEach((val) => {
                  if (val.category_id == id) {
                    arr.push(val)
                  }
                })
                this.jici_list = arr
              }
            }
          } else if (num == 'shop') {
            // 获取
            if (res.data.tenant_commodity) {
              this.shop_fenlei = res.data.tenant_commodity.filter(
                (val) => val.status !== 1
              )
              // 获取计次分类下的列表
              const shop_list = JSON.parse(localStorage.getItem('shop_list'))
              // console.log(jici_list)
              if (shop_list) {
                let arr = []
                shop_list.forEach((val) => {
                  if (val.category_id == id) {
                    arr.push(val)
                  }
                })
                this.shop_list = arr
              }
            }
          }
        }
      })
    },
    change_shop (e) {
      this.get_project('shop', e)
    },
    // 选择计次
    change_jc (e) {
      this.get_project('jici', e)
    },
    // 选择项目
    change_project (e) {
      this.get_project('project', e)
    },
    // 提交
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const rule = JSON.stringify(
            Object.assign(
              this.formItem1,
              { department: this.department },
              { position: this.position },
              { grade: this.grade }
            )
          )
          add_royalty(this.position_id, this.$route.params.name, rule).then(
            (res) => {
              if (res.code == 0) {
                this.$Message.success('设置成功!')
                if (this.$route.params.name != 'tenant_speedy') {
                  let obj = {
                    sex: 'buqufen',
                    jishu: 'female',
                    tourist: 'bili',
                    tourist_no: 'bili',
                    achievement: 'bili',
                    achievement_no: 'bili',
                    cost_select: 'bili',
                    no_cost_select: 'bili',
                    select: 'bili',
                    no_select: 'bili'
                  }
                  this.formItem1 = obj
                }
              }
            }
          )
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    // 获取项目的提成规则
    get_category () {
      getRoyalty(this.position_id).then((res) => {
        if (res.code == 0) {
          if (this.$route.params.name == 'tenant_project') {
            // 服务项目提成规则
            for (let i in res.data.tenant_project) {
              res.data.tenant_project[i]
                .filter((val) => val.position_id == this.position_id)
                .map((val) => {
                  if (val.rule != null) {
                    if (
                      JSON.parse(val.rule).grade == this.grade &&
                      JSON.parse(val.rule).projects ==
                        this.formItem1.projects &&
                      JSON.parse(val.rule).projects_list ==
                        this.formItem1.projects_list
                    ) {
                      // 选择了明细项目的情景
                      this.modal1 = true
                      this.formItem2 = JSON.parse(val.rule)
                      this.formItem2.id = val.id
                    } else if (
                      JSON.parse(val.rule).grade == this.grade &&
                      JSON.parse(val.rule).projects ==
                        this.formItem1.projects &&
                      typeof JSON.parse(val.rule).projects_list === 'undefined'
                    ) {
                      // 没有选择明细项目分类的情景
                      this.modal1 = true
                      this.formItem2 = JSON.parse(val.rule)
                      this.formItem2.id = val.id
                    }
                  }
                })
            }
          } else if (this.$route.params.name == 'tenant_speedy') {
            // 快速消费提成规则
            for (let i in res.data.tenant_speedy) {
              res.data.tenant_speedy[i]
                .filter((val) => val.position_id == this.position_id)
                .map((val) => {
                  if (val.rule != null) {
                    if (JSON.parse(val.rule).grade == this.grade) {
                      this.modal1 = true
                      this.formItem2 = JSON.parse(val.rule)
                      this.formItem2.id = val.id
                    }
                  }
                })
            }
          } else if (this.$route.params.name == 'tenant_member') {
            // 开卡提成获取
            for (let i in res.data.tenant_member) {
              res.data.tenant_member[i]
                .filter((val) => val.position_id == this.position_id)
                .map((val) => {
                  if (val.rule != null) {
                    if (
                      JSON.parse(val.rule).grade == this.grade &&
                      JSON.parse(val.rule).kaika == this.formItem1.kaika
                    ) {
                      this.modal2 = true
                      this.formItem2 = JSON.parse(val.rule)
                      this.formItem2.id = val.id
                    }
                  }
                })
            }
          } else if (this.$route.params.name == 'tenant_deposit') {
            // 充值提成获取
            for (let i in res.data.tenant_deposit) {
              res.data.tenant_deposit[i]
                .filter((val) => val.position_id == this.position_id)
                .map((val) => {
                  if (val.rule != null) {
                    if (
                      JSON.parse(val.rule).grade == this.grade &&
                      JSON.parse(val.rule).kaika == this.formItem1.kaika
                    ) {
                      this.modal2 = true
                      this.formItem2 = JSON.parse(val.rule)
                      this.formItem2.id = val.id
                    }
                  }
                })
            }
          } else if (this.$route.params.name == 'tenant_meter') {
            // 计次提成获取

            for (let i in res.data.tenant_meter) {
              res.data.tenant_meter[i]
                .filter((val) => val.position_id == this.position_id)
                .map((val) => {
                  if (val.rule != null) {
                    if (
                      JSON.parse(val.rule).grade == this.grade &&
                      JSON.parse(val.rule).jici == this.formItem1.jici &&
                      JSON.parse(val.rule).jicis_list ==
                        this.formItem1.jicis_list
                    ) {
                      this.modal3 = true
                      this.formItem2 = JSON.parse(val.rule)
                      this.formItem2.id = val.id
                    } else if (
                      JSON.parse(val.rule).grade == this.grade &&
                      JSON.parse(val.rule).jici == this.formItem1.jici &&
                      typeof JSON.parse(val.rule).jicis_list === 'undefined'
                    ) {
                      this.modal3 = true
                      this.formItem2 = JSON.parse(val.rule)
                      this.formItem2.id = val.id
                    }
                  }
                })
            }
          } else if (this.$route.params.name == 'tenant_wastage') {
            // 耗品提成获取
            for (let i in res.data.tenant_wastage) {
              res.data.tenant_wastage[i]
                .filter((val) => val.position_id == this.position_id)
                .map((val) => {
                  if (val.rule != null) {
                    if (
                      JSON.parse(val.rule).grade == this.grade &&
                      JSON.parse(val.rule).kaika == this.formItem1.kaika
                    ) {
                      this.modal1 = true
                      this.formItem2 = JSON.parse(val.rule)
                      this.formItem2.id = val.id
                    }
                  }
                })
            }
          } else if (this.$route.params.name == 'tenant_commodity') {
            // 商品提成规则获取
            for (let i in res.data.tenant_commodity) {
              res.data.tenant_commodity[i]
                .filter((val) => val.position_id == this.position_id)
                .map((val) => {
                  if (val.rule != null) {
                    if (
                      JSON.parse(val.rule).grade == this.grade &&
                      JSON.parse(val.rule).shops == this.formItem1.shops &&
                      JSON.parse(val.rule).shops_list ==
                        this.formItem1.shops_list
                    ) {
                      this.modal1 = true
                      this.formItem2 = JSON.parse(val.rule)
                      this.formItem2.id = val.id
                    } else if (
                      JSON.parse(val.rule).grade == this.grade &&
                      JSON.parse(val.rule).shops == this.formItem1.shops &&
                      typeof JSON.parse(val.rule).shops_list === 'undefined'
                    ) {
                      this.modal1 = true
                      this.formItem2 = JSON.parse(val.rule)
                      this.formItem2.id = val.id
                    }
                  }
                })
            }
          }
        }
      })
    },
    // 修改提成规则
    edit () {
      const rule = JSON.stringify(
        Object.assign(
          this.formItem2,
          { department: this.department },
          { position: this.position },
          { grade: this.grade }
        )
      )
      edit_royalty(
        this.formItem2.id,
        this.position_id,
        this.$route.params.name,
        rule
      ).then((res) => {
        if (res.code == 0) {
          this.modal1 = false
          this.modal2 = false
          this.modal3 = false
          this.$Message.success('修改成功！')
        }
      })
    },
    // 删除提成规则
    del () {
      let that = this
      that.$Modal.confirm({
        title: '信息',
        content: '是否确认删除?',
        onOk () {
          del_royalty(that.formItem2.id).then((res) => {
            console.log(res)
            if (res.code == 0) {
              that.modal1 = false
              that.modal2 = false
              that.modal3 = false
              that.$Message.success('删除成功！')
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.button .ivu-radio-default {
  width: 100%;
  margin: 5px 0;
}
.list {
  display: flex;
}
.mt {
  margin-top: 20px;
}
</style>
