/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import * as Styles from "components/manage-vm/settings-panel/SettingsPanel.style";
import PropTypes from "prop-types";
import {
  upgradeInitialValues,
  templateInitialValues,
} from "components/manage-vm/utils";
import Loading from "components/common/loading";
import { Formik } from "formik";
import ConditionalFragment from "components/conditional-fragment";
import { Actions, Info } from "./components";
import Upgrade from "./upgrade";
import ReverseDNS from "./reverse-dns";
import Templates from "./templates";
import { TabsHeader } from "../components";
import { settingTabs } from "constants/index";
import { useSelector } from "react-redux";
import { userRights } from "store/selectors/user-details";

const DesktopSettingsPanel = ({
  isLoading,
  sizeData,
  isClose,
  data,
  fundsData,
  sliderData,
  sliderSuccess,
  sliderSizeData,
  menuOptions,
  type,
  upgradeProps,
  refreshServer,
  serverActionsLoading,
  initialTab,
  setDeletedIds,
  managerVmRefetch,
  allTags,
  isTags,
  statusOfServer,
  managerVmIsFetching,
  serverSizeLoading,
  serverSizeData,
  initialActionTab,
}) => {
  const rights = useSelector(userRights);
  const initial =
    type == "bm"
      ? initialTab || menuOptions[0].id
      : initialTab ||
        (rights.vschange ? settingTabs.upgrade : menuOptions[0].id);
  const [isShowConfigurationPanel, setIsShowConfigurationPanel] =
    useState(initial);

  if (isLoading || serverSizeLoading) {
    return <Loading gap={50} />;
  }
  return (
    <Styles.SettingPanel>
      <TabsHeader
        data={data}
        menuOptions={menuOptions}
        activePanelValue={isShowConfigurationPanel}
        setActivePanelValue={setIsShowConfigurationPanel}
        isClose={isClose}
      />
      <ConditionalFragment condition={isShowConfigurationPanel === "upgrade"}>
        <Formik
          initialValues={upgradeInitialValues}
          validationSchema={upgradeProps.validation}
          onSubmit={(values, props) =>
            upgradeProps.handleServerUpgrade(values, props)
          }
        >
          {(formikProp) => (
            <Upgrade
              fundsData={fundsData}
              serverSizes={sizeData}
              formikProp={formikProp}
              sliderData={sliderData}
              sliderSuccess={sliderSuccess}
              sliderSizeData={sliderSizeData}
              data={data}
              loading={
                upgradeProps.updateServerSideLoading ||
                upgradeProps.saveAndChargeCardLoad ||
                upgradeProps.chargeSavedCardLoad
              }
            />
          )}
        </Formik>
      </ConditionalFragment>
      <ConditionalFragment
        condition={isShowConfigurationPanel === settingTabs.actions}
      >
        <Actions
          data={data}
          refreshServer={refreshServer}
          loading={serverActionsLoading}
          type={type}
          setDeletedIds={setDeletedIds}
          initialTab={initialActionTab}
          managerVmRefetch={managerVmRefetch}
        />
      </ConditionalFragment>
      <ConditionalFragment
        condition={isShowConfigurationPanel === settingTabs["info/IPs"]}
      >
        <Info
          serverSizeData={serverSizeData}
          data={data}
          type={type}
          managerVmRefetch={managerVmRefetch}
          allTags={allTags}
          isTags={isTags}
          statusOfServer={statusOfServer}
          managerVmIsFetching={managerVmIsFetching}
        />
      </ConditionalFragment>
      <ConditionalFragment
        condition={isShowConfigurationPanel === settingTabs.reverse_DNS}
      >
        <ReverseDNS data={data} type={type} />
      </ConditionalFragment>
      <ConditionalFragment
        condition={
          isShowConfigurationPanel === settingTabs["templates/backups"]
        }
      >
        <Formik initialValues={templateInitialValues}>
          {(formikProp) => (
            <Templates
              formikProp={formikProp}
              data={data}
              managerVmRefetch={managerVmRefetch}
            />
          )}
        </Formik>
      </ConditionalFragment>
    </Styles.SettingPanel>
  );
};

export default React.memo(DesktopSettingsPanel);
DesktopSettingsPanel.propTypes = {
  isClose: PropTypes.any,
  data: PropTypes.object,
  fundsData: PropTypes.object.isRequired,
  sizeData: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  sliderData: PropTypes.any,
  sliderSuccess: PropTypes.bool,
  sliderSizeData: PropTypes.any,
  menuOptions: PropTypes.array,
  type: PropTypes.string,
  upgradeProps: PropTypes.any,
  refreshServer: PropTypes.func,
  serverActionsLoading: PropTypes.bool,
  initialTab: PropTypes.string,
};
