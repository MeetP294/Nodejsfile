import React from "react";
import { connect } from "react-redux";
import chunk from "lodash.chunk";
import { addItemToCart } from "../store/slices/cart";
import { Radio, Checkbox, Row, Col, Input, Button } from "antd";
import { renderUSD } from "../utils";
import "./MenuItemForm.less";

function MenuItemForm(props) {
  const { getVariationById, getItemById, getModifierById } = props;
  const { onOk, isEditing, itemId } = props;

  let init = props.init || {};

  // Find the item in the menu using its ID
  const item = getItemById(itemId);

  if (item.modifiers) {
    if (!init.modifiers) init.modifiers = {};

    for (let modifier of item.modifiers) {
      if (!init.modifiers[modifier.id]) {
        init.modifiers[modifier.id] = false;
      }
    }
  } else init.modifiers = null;
  // Initialize modifier groups
  if (item.attribute_groups) {
    if (!init.modifierGroups) init.modifierGroups = {};

    item.attribute_groups.forEach((group) => {
      if (init.modifierGroups[group.id] !== undefined) return;

      const { multiple_select, id } = group;
      const isMultiSelect = multiple_select === "1";
      // If the Attribute Group allows multiple selections
      // represent this by initializing it as an empty Array []
      // Otherwise initialize it as null

      init.modifierGroups[id] = isMultiSelect ? [] : null;
    });
  }

  /** Modifier state will be represented like this:
   *
   *  modifiers = {
        [modifierId] : true/false
        ...
   *  }
   */

  const [modifierGroups, setModifierGroups] = React.useState(
    init.modifierGroups
  );
  const [modifiers, setModifiers] = React.useState(init.modifiers);
  const setModifierById = (id, value) =>
    setModifiers((m) => ({ ...m, [id]: value }));

  const setModifierByGroupIdAndModifierId = (groupId, modifierId, value) => {
    const newModifierGroups = { ...modifierGroups };
    if (modifierGroups[groupId] instanceof Array) {
      if (!value) {
        newModifierGroups[groupId] = newModifierGroups[groupId].filter(
          (id) => id !== modifierId
        );
      } else {
        newModifierGroups[groupId].push(modifierId);
      }
    } else {
      if (value) {
        newModifierGroups[groupId] = modifierId;
      } else {
        newModifierGroups[groupId] = null;
      }
    }
    setModifierGroups(newModifierGroups);
  };

  const [instructions, setInstructions] = React.useState(init.instructions);
  const [quantity, setQuantity] = React.useState(init.quantity);
  // Unless otherwise specified in init prop, first variation is selected by default
  const [selectedVariation, setSelectedVariation] = React.useState(
    init.variation || item.variations[0]
  );

  const totalCost = React.useMemo(() => {
    // debugger;
    const currentVariation = getVariationById(selectedVariation);
    const pricePerUnit = currentVariation.price;

    // Calculate cost contribution of modifiers
    const selectedModifierIds = Object.entries(modifiers)
      .reduce((acc, [key, val]) => {
        if (val) {
          return [...acc, key];
        } else return acc;
      }, [])
      .concat(
        Object.values(modifierGroups).reduce((acc, g) => {
          if (Array.isArray(g)) {
            acc = acc.concat(g);
          } else if (g !== null) {
            acc.push(g);
          }

          return acc;
        }, [])
      );
    const modifiersTotalCost =
      selectedModifierIds.length === 0
        ? 0
        : selectedModifierIds.reduce((acc, modifierId) => {
            // Sum up  the cost contribution of each modifier
            const modifierPrice = getModifierById(modifierId).price;
            return acc + modifierPrice;
          }, 0);

    return (pricePerUnit + modifiersTotalCost) * quantity;
  }, [
    getModifierById,
    selectedVariation,
    modifiers,
    quantity,
    modifierGroups,
    getVariationById,
  ]);

  // Every time modifiers change, check if requirements met
  // const isSubmittable = React.useMemo(() => {
  //   // Item can be submitted with modification if either
  //   // 1. no modifiers are req'd or,
  //   // 2. those that are req'd have default values
  //   const canBeSubmittedWithoutModification =
  //     item.modifiers === undefined ||
  //     !item.modifiers.some(
  //       (modifier) => modifier.required && !modifier.default
  //     );

  //   // console.log("can be subd without mod", canBeSubmittedWithoutModification);
  //   if (canBeSubmittedWithoutModification) return true;

  //   if (item.modifiers) {
  //     let newIsSubmittable = true;
  //     item.modifiers.forEach((m) => {
  //       // If the modifier is required and currently has no value...
  //       if (m.required && !modifiers[m.name]) {
  //         // Set value to false and break
  //         newIsSubmittable = false;
  //       }
  //     });

  //     return newIsSubmittable;
  //   }
  // }, [modifiers, item.modifiers]);

  const renderModifierPrice = (modPrice) => {
    if (typeof modPrice === "string") return "$" + modPrice;
    // Check if price has fractional part
    const hasCents = modPrice % 1 !== 0;

    if (hasCents) {
      return "$" + modPrice.toFixed(2);
    } else return "$" + modPrice;
  };

  const modifierCheckboxes = Object.entries(modifiers).map(
    ([modifierId, modifierVal]) => {
      const modifier = getModifierById(modifierId);
      return (
        <Checkbox
          onChange={(e) => {
            const newValue = e.target.checked;
            setModifierById(modifierId, newValue);
          }}
          checked={modifiers[modifierId]}
        >
          {modifier.name}
          {modifier.price && modifier.price > 0
            ? ` (${renderModifierPrice(modifier.price)})`
            : null}
        </Checkbox>
      );
    }
  );

  const NUM_COLS = 2;
  const modifierGrid = chunk(modifierCheckboxes, NUM_COLS).map((chunk) => (
    <div className="MenuItemForm__modifier-group">
      <Row>
        {chunk.map((checkbox) => (
          <Col span={24 / NUM_COLS}>{checkbox}</Col>
        ))}
      </Row>
    </div>
  ));

  const modifierGroupSection = modifierGroups && (
    <>
      {item.attribute_groups
        .reduce((deDuped, group) => {
          if (deDuped.find((g) => g.id === group.id)) {
            // this group is already present in array
            return deDuped;
          } else {
            return [...deDuped, group];
          }
        }, [])
        .map(({ id: groupId, title, attributes, multiple_select }) => (
          <div key={groupId} className="MenuItemForm__modifier-group">
            <h4 className="MenuItemForm__modifier-group-label">
              {title}
              {multiple_select !== "1" && " (Select One)"}
            </h4>
            {chunk(attributes, 2).map((chunk) => (
              <Row>
                {chunk.map(({ attribute_id, name, price }) => {
                  const isChecked = (attribute_id) => {
                    if (modifierGroups[groupId] instanceof Array) {
                      return modifierGroups[groupId].includes(attribute_id);
                    } else return modifierGroups[groupId] === attribute_id;
                  };

                  return (
                    <Col span={12}>
                      <Checkbox
                        onChange={(e) => {
                          const newValue = e.target.checked;

                          setModifierByGroupIdAndModifierId(
                            groupId,
                            attribute_id,
                            newValue
                          );
                        }}
                        checked={isChecked(attribute_id)}
                      >
                        {name}
                        {price && price > 0
                          ? ` (${renderModifierPrice(price)})`
                          : null}
                      </Checkbox>
                    </Col>
                  );
                })}
              </Row>
            ))}
          </div>
        ))}
    </>
  );

  return (
    <div className="MenuItemForm">
      {props.title}
      <p className="lightbox__description">{item.description}</p>
      {item.ingredients ? (
        <div>
          <h4 className="lightbox__ingredients">Ingredients</h4>
          <p className="lightbox__description">{item.ingredients}</p>
        </div>
      ) : null}
      {item.variations.length > 1 ? (
        <div>
          <h4 className="lightbox__ingredients">
            {/* @TODO change this className */}
            <span>Options</span>
          </h4>
          <Radio.Group
            onChange={(e) => {
              const { value } = e.target;
              setSelectedVariation(value);
            }}
            value={selectedVariation}
          >
            <Row>
              {item.variations.map((v) => {
                const variation = getVariationById(v);
                const label = !!variation.name ? variation.name : item.title;
                return (
                  <Col xs="24" m="12" key={v}>
                    <Radio value={v}>
                      {label} (${variation.price})
                    </Radio>
                  </Col>
                );
              })}
            </Row>
          </Radio.Group>
        </div>
      ) : null}
      {item.modifiers.length > 0 && (
        <div>
          <h4 className="lightbox__ingredients">
            <span>Modifiers</span>
            {/* <div>
              debugging
              {JSON.stringify(item.modifiers)}
            </div> */}
            {/* {modifier.required && <strong>(required)</strong>} */}
          </h4>

          <Row className="MenuItemForm__modifiers-container">
            {modifierGrid}
          </Row>
        </div>
      )}
      {modifierGroupSection ? (
        <Row className="MenuItemForm__modifiers-container">
          {modifierGroupSection}
        </Row>
      ) : null}
      <div>
        <h4 className="lightbox__special-title">Special Instructions</h4>
        <Input.TextArea
          value={instructions}
          onChange={(e) => {
            const {
              target: { value },
            } = e;
            setInstructions(value);
          }}
        />
      </div>

      <div className="lightbox__footer">
        <div className="lightbox__select-quantity">
          <Button
            className="lightbox__button"
            disabled={quantity === 1}
            onClick={() => {
              const newQuantity = quantity - 1;
              setQuantity(newQuantity);
            }}
          >
            -
          </Button>
          <p className="lightbox__quantity">{quantity}</p>
          <Button
            className="lightbox__button"
            onClick={() => {
              const newQuantity = quantity + 1;
              setQuantity(newQuantity);
            }}
          >
            +
          </Button>
        </div>
        <div className="lightbox__button-wrapper">
          <Button
            onClick={() => {
              // combine single modifiers and modifier groups
              // into one object mapping modifier
              // id -> selection_status
              const groupedModifiers = Object.values(modifierGroups).reduce(
                (acc, entry) => {
                  if (Array.isArray(entry)) {
                    for (let modifierId of entry) {
                      acc[modifierId] = true;
                    }
                  } else if (entry !== null) {
                    acc[entry] = true;
                  }
                  return acc;
                },
                {}
              );
              const allModifiers = { ...modifiers, ...groupedModifiers };

              props.handleSubmit({
                variationId: selectedVariation,
                modifiers: allModifiers,
                quantity,
                instructions,
              });
              onOk();
            }}
            className="lightbox__add-button"
            type="primary"
            block
            // disabled={!isSubmittable}
          >
            {isEditing ? (
              <span>Confirm Edit</span>
            ) : (
              <>
                <span>{`Add ${quantity > 1 ? quantity + " " : ""}Item${
                  quantity > 1 ? "s" : ""
                }`}</span>
                <span>{renderUSD(totalCost)}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => ({
  ...state,
  getVariationById: (id) => {
    return state.venue.data.menu.variationsById[id];
  },
  getAttributesGroupById: (id) => state.venue.data.attributeGroupsById[id],
  getModifierById: (id) => state.venue.data.modifiersById[id],
  getItemById: (id) => state.venue.data.menu.itemsById[id],
});
const mapDispatchToProps = (dispatch) => ({
  addItemToCart: (item) => dispatch(addItemToCart(item)),
});
export default connect(mapStateToProps, mapDispatchToProps)(MenuItemForm);
