exports.getAction = async function(tags) {
  let action = null;
  let element = null;
  console.log("TAGSSSSS: ", tags)
  tags.forEach(tg => {
    if(tg == 'create' || tg == 'add') {
      action = "create";
    }
    if(tg == 'update' || tg == 'modify') {
      action = "update";
    }
    if(tg == 'assign') {
      action = "assign";
    }
    if(tg == 'task' || tg == 'tasks') {
      if(element != 'employee') element = 'task';
    }
    if(tg == 'employee' || tg == 'staff' || tg == 'person' || tg == 'worker') {
      element = 'employee';
    }
    if(tg == 'goal' || tg == 'goals') {
      if(element != 'employee') element = 'goal';
    }
    if(tg == 'organization' || tg == 'organizations') {
      element = 'organization';
    }
    if(tg == 'progress' || tg == 'status') {
      element = 'task status';
    }
  });
  if(action && element) {
    return { action: action, element: element, variables: [] };
  } else {
    return { action: 'search', element: element, variables: [] }
  }
};
